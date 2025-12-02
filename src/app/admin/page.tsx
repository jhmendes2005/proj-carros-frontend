"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/src/lib/api";
import { 
  RefreshCw, Trash2, PlusCircle, CheckCircle, AlertTriangle, 
  BarChart3, Settings, Car, Save, Plus, X, Edit, Loader2
} from "lucide-react";

interface ScriptConfig {
  type: "GTM" | "PIXEL" | "ANALYTICS";
  code: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "estoque" | "config">("dashboard");

  // Dados
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0, whatsapp: 0, shares: 0 });
  
  // Configuração
  const [configId, setConfigId] = useState<number | null>(null);
  const [syncUrl, setSyncUrl] = useState("");
  const [apiType, setApiType] = useState("ALTIMUS");
  const [scripts, setScripts] = useState<ScriptConfig[]>([]);
  
  // UI States
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0); // 🟢 Novo estado de progresso
  const [isSaving, setIsSaving] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  
  // Seleção e Exclusão
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal de Edição
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
    loadAllData();
  }, [router]);

  async function loadAllData() {
    fetchVehicles();
    
    // Carregar Config
    api.get("/config").then((res) => {
        if (res.data) {
            setConfigId(res.data.id);
            setSyncUrl(res.data.apiUrl || "");
            setApiType(res.data.apiType || "ALTIMUS");
            setScripts((res.data.scripts as ScriptConfig[]) || []);
        }
    }).catch(console.error);

    // Carregar Stats
    api.get("/analytics/summary")
       .then(res => setStats(res.data))
       .catch(() => setStats({ views: 0, whatsapp: 0, shares: 0 }));
  }

  function fetchVehicles() {
    api.get("/vehicles").then((res) => {
        setVehicles(res.data);
        setSelectedIds([]); 
    }).catch(console.error);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  // --- FUNÇÕES DE SELEÇÃO ---
  const toggleSelectAll = () => {
      if (selectedIds.length === vehicles.length) {
          setSelectedIds([]);
      } else {
          setSelectedIds(vehicles.map(v => v.id));
      }
  };

  const toggleSelectOne = (id: number) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(i => i !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  // --- FUNÇÕES DE EXCLUSÃO ---
  async function handleDeleteSelected() {
      if (selectedIds.length === 0) return;
      if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} veículos selecionados?`)) return;

      setIsDeleting(true);
      try {
          await Promise.all(selectedIds.map(id => api.delete(`/vehicles/${id}`)));
          setVehicles(prev => prev.filter(v => !selectedIds.includes(v.id)));
          setSelectedIds([]);
          alert("Veículos excluídos com sucesso!");
      } catch (error) {
          alert("Erro ao excluir alguns veículos.");
      } finally {
          setIsDeleting(false);
      }
  }

  async function handleDeleteAll() {
      if (vehicles.length === 0) return;
      if (!confirm("PERIGO: Isso apagará TODOS os veículos do seu estoque. Tem certeza absoluta?")) return;

      setIsDeleting(true);
      try {
          const allIds = vehicles.map(v => v.id);
          await Promise.all(allIds.map(id => api.delete(`/vehicles/${id}`)));
          setVehicles([]);
          setSelectedIds([]);
          alert("Estoque limpo com sucesso!");
      } catch (error) {
          alert("Erro ao limpar estoque.");
      } finally {
          setIsDeleting(false);
      }
  }

  // --- SINCRONIZAÇÃO COM BARRA DE PROGRESSO ---
  async function handleSync() {
    if (!syncUrl) return alert("Digite a URL da API de estoque.");
    
    setIsSyncing(true);
    setSyncResult(null);
    setProgress(0); // Reinicia a barra

    // 🟢 Simula o progresso visualmente (já que o backend não envia progresso em tempo real)
    // Aumenta 10% a cada 800ms até chegar em 90% e espera
    const progressInterval = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 90) return 90; // Trava em 90% esperando o backend
            return prev + Math.random() * 10;
        });
    }, 800);

    try {
      await handleSaveConfig(false); 
      // Essa chamada demora porque o Backend está esperando o Webhook do n8n responder para cada carro
      const response = await api.post(`/vehicles/process?url=${encodeURIComponent(syncUrl)}&type=${apiType}`);
      
      // Quando o backend responde, completamos a barra
      clearInterval(progressInterval);
      setProgress(100);
      
      setSyncResult(response.data);
      fetchVehicles();
    } catch (error: any) {
      clearInterval(progressInterval);
      setProgress(0); // Zera em caso de erro
      console.error("Erro sync:", error);
      const msg = error.response?.data?.message || "Erro ao conectar.";
      setSyncResult({ success: false, message: msg });
    } finally {
      // Pequeno delay para mostrar o 100% antes de habilitar o botão
      setTimeout(() => setIsSyncing(false), 500);
    }
  }

  // --- CONFIGURAÇÃO ---
  async function handleSaveConfig(showAlert = true) {
    setIsSaving(true);
    try {
        const payload = {
            apiUrl: syncUrl,
            apiType: apiType,
            scripts: scripts
        };
        
        if (configId) {
            await api.put(`/config/${configId}`, payload);
        } else {
            const res = await api.post("/config", payload);
            if(res.data?.id) setConfigId(res.data.id);
        }
        
        if(showAlert) alert("Configurações salvas!");
    } catch (error) {
        console.error("Erro config:", error);
        if(showAlert) alert("Erro ao salvar config.");
    } finally {
        setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
      if(!confirm("Tem certeza que deseja excluir este veículo?")) return;
      try {
          await api.delete(`/vehicles/${id}`);
          setVehicles(prev => prev.filter(v => v.id !== id));
      } catch (error) {
          alert("Erro ao excluir veículo");
      }
  }

  async function handleUpdateVehicle(e: React.FormEvent) {
      e.preventDefault();
      if (!editingVehicle) return;
      setIsUpdating(true);
      try {
          await api.put(`/vehicles/${editingVehicle.id}`, {
              preco: Number(editingVehicle.preco),
              destaque: editingVehicle.destaque,
              marca: editingVehicle.marca,
              modelo: editingVehicle.modelo,
              versao: editingVehicle.versao
          });
          setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? editingVehicle : v));
          setEditingVehicle(null);
      } catch (error) {
          alert("Erro ao atualizar veículo.");
      } finally {
          setIsUpdating(false);
      }
  }

  const addScript = () => setScripts([...scripts, { type: "GTM", code: "" }]);
  const removeScript = (idx: number) => setScripts(scripts.filter((_, i) => i !== idx));
  const updateScript = (idx: number, field: keyof ScriptConfig, value: string) => {
      const newScripts = [...scripts];
      newScripts[idx] = { ...newScripts[idx], [field]: value };
      setScripts(newScripts);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Olá, <strong>{user.nome}</strong></span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">Sair</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <nav className="p-4 space-y-2">
                {[
                    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
                    { id: "estoque", icon: Car, label: "Estoque" },
                    { id: "config", icon: Settings, label: "Configurações" }
                ].map(item => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <item.icon size={20} /> {item.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-64px)] relative">
            
            {/* Dashboard */}
            {activeTab === "dashboard" && (
                <div className="space-y-6 animate-in fade-in">
                    <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardStat label="Visualizações" value={stats.views} sub="Páginas visitadas" />
                        <CardStat label="WhatsApp Clicks" value={stats.whatsapp} sub="Leads gerados" color="text-green-600" />
                        <CardStat label="Compartilhamentos" value={stats.shares} sub="Engajamento" color="text-blue-600" />
                    </div>
                </div>
            )}

            {/* Estoque */}
            {activeTab === "estoque" && (
                <div className="space-y-6 animate-in fade-in">
                    {/* Barra de Ferramentas */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Estoque</h2>
                            {selectedIds.length > 0 && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                                    {selectedIds.length} selecionados
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {selectedIds.length > 0 ? (
                                <button 
                                    onClick={handleDeleteSelected}
                                    disabled={isDeleting}
                                    className="flex-1 md:flex-none text-sm bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2 shadow-sm transition-all"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Excluir Selecionados
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleDeleteAll}
                                        disabled={isDeleting}
                                        className="flex-1 md:flex-none text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Trash2 size={16} /> Limpar Estoque
                                    </button>
                                    <button className="flex-1 md:flex-none text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-all">
                                        <PlusCircle size={16} /> Novo Manual
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={vehicles.length > 0 && selectedIds.length === vehicles.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4">Veículo</th>
                                    <th className="px-6 py-4">Ano</th>
                                    <th className="px-6 py-4">Preço</th>
                                    <th className="px-6 py-4">Origem</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vehicles.map((v) => (
                                    <tr key={v.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(v.id) ? 'bg-blue-50/50' : ''}`}>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                checked={selectedIds.includes(v.id)}
                                                onChange={() => toggleSelectOne(v.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {v.marca} {v.modelo}
                                            <span className="block text-xs text-gray-500 font-normal">{v.versao?.slice(0, 30)}...</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{v.anoModelo}</td>
                                        <td className="px-6 py-4 text-green-700 font-bold">
                                            {Number(v.preco).toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${v.idExterno ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {v.idExterno ? 'API' : 'Manual'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <button 
                                                onClick={() => setEditingVehicle(v)}
                                                className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(v.id)}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {vehicles.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Nenhum veículo encontrado no estoque.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Configurações */}
            {activeTab === "config" && (
                <div className="max-w-4xl space-y-8 animate-in fade-in">
                    <h2 className="text-2xl font-bold text-gray-800">Configurações</h2>

                    {/* Sincronização */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <RefreshCw size={20} className="text-blue-600" /> API de Estoque
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Integração</label>
                                    <select 
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white"
                                        value={apiType}
                                        onChange={(e) => setApiType(e.target.value)}
                                    >
                                        <option value="ALTIMUS">Altimus</option>
                                        <option value="AUTOCERTO">AutoCerto</option>
                                        <option value="BOOM">Boom Sistemas</option>
                                        <option value="REVENDAMAIS">Revenda Mais</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL do JSON</label>
                                    <input 
                                        type="text" 
                                        placeholder="https://api..."
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                                        value={syncUrl}
                                        onChange={(e) => setSyncUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* BARRA DE PROGRESSO E BOTÃO */}
                            <div className="space-y-2">
                                {/* Barra visual */}
                                {isSyncing && (
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button 
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className={`flex-1 py-2.5 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${isSyncing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                    >
                                        {isSyncing ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" /> 
                                                Sincronizando {Math.floor(progress)}%...
                                            </>
                                        ) : "Sincronizar Agora"}
                                    </button>
                                    <button 
                                        onClick={() => handleSaveConfig(true)}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200"
                                    >
                                        {isSaving ? "Salvando..." : "Salvar Config"}
                                    </button>
                                </div>
                            </div>

                            {syncResult && (
                                <div className={`p-4 rounded-lg border text-sm ${syncResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                    {syncResult.success ? (
                                        <p>✅ <b>Sucesso!</b> Novos: {syncResult.inseridos}, Atualizados: {syncResult.atualizados}, Removidos: {syncResult.removidos}</p>
                                    ) : (
                                        <p>❌ {syncResult.message}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Scripts */}
                    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <BarChart3 size={20} className="text-purple-600" /> Rastreamento (Pixel/GTM)
                            </h3>
                            <button onClick={addScript} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                <Plus size={16} /> Adicionar
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {scripts.map((script, idx) => (
                                <div key={idx} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg">
                                    <div className="w-1/3 md:w-1/4">
                                        <select 
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white"
                                            value={script.type}
                                            onChange={(e) => updateScript(idx, 'type', e.target.value as any)}
                                        >
                                            <option value="GTM">Google Tag Manager</option>
                                            <option value="PIXEL">Facebook Pixel</option>
                                            <option value="ANALYTICS">Google Analytics 4</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            type="text" 
                                            placeholder="Ex: GTM-XXXXXX"
                                            className="w-full border border-gray-300 rounded-md p-2 text-sm"
                                            value={script.code}
                                            onChange={(e) => updateScript(idx, 'code', e.target.value)}
                                        />
                                    </div>
                                    <button onClick={() => removeScript(idx)} className="text-gray-400 hover:text-red-500 p-2">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-gray-100 flex justify-end">
                                <button onClick={() => handleSaveConfig(true)} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm">
                                    <Save size={18} /> Salvar Alterações
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* --- MODAL DE EDIÇÃO --- */}
            {editingVehicle && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in zoom-in-50 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Editar Veículo</h3>
                            <button onClick={() => setEditingVehicle(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdateVehicle} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                    <input 
                                        type="text" 
                                        className="w-full border rounded-lg p-2"
                                        value={editingVehicle.marca} 
                                        onChange={e => setEditingVehicle({...editingVehicle, marca: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                    <input 
                                        type="text" 
                                        className="w-full border rounded-lg p-2"
                                        value={editingVehicle.modelo} 
                                        onChange={e => setEditingVehicle({...editingVehicle, modelo: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Versão</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-lg p-2"
                                    value={editingVehicle.versao || ""} 
                                    onChange={e => setEditingVehicle({...editingVehicle, versao: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                    <input 
                                        type="number" 
                                        className="w-full border rounded-lg p-2 font-bold text-green-700"
                                        value={editingVehicle.preco} 
                                        onChange={e => setEditingVehicle({...editingVehicle, preco: e.target.value})}
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 text-blue-600 rounded"
                                            checked={editingVehicle.destaque}
                                            onChange={e => setEditingVehicle({...editingVehicle, destaque: e.target.checked})}
                                        />
                                        <span className="text-gray-700 font-medium">Destaque na Home</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setEditingVehicle(null)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isUpdating}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex justify-center gap-2"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
      </div>
    </div>
  );
}

// Componente simples para os Cards do Dashboard
function CardStat({ label, value, sub, color = "text-gray-900" }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            <span className="text-xs text-gray-400 mt-2">{sub}</span>
        </div>
    )
}