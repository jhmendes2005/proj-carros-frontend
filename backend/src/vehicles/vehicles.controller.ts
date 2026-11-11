import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { StockSyncService } from './stock-sync.service'; 

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly stockSync: StockSyncService
  ) {}

  @Get('search')
  searchVehicles(@Query('q') query: string) { return this.vehiclesService.search(query); }

  @Get('featured')
  getFeaturedVehicles(@Query('count') count?: string) {
    return this.vehiclesService.findFeatured(Number(count) || 6);
  }

  // --- FILTROS DINÂMICOS ---
  
  @Get('filters/brands')
  getFilterBrands(@Query('type') type?: string) { 
    return this.vehiclesService.getFilterBrands(type); 
  }

  @Get('filters/models')
  getFilterModels(
    @Query('brand') brand?: string, 
    @Query('type') type?: string
  ) { 
    return this.vehiclesService.getFilterModels(brand, type); 
  }

  @Get('filters/years')
  getFilterYears(
    @Query('brand') brand?: string,
    @Query('model') model?: string,
    @Query('type') type?: string
  ) { 
    return this.vehiclesService.getFilterYears(brand, model, type); 
  }

  // -------------------------

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('marca') marca?: string,
    @Query('modelo') modelo?: string,
    @Query('tipo') tipo?: string,
    @Query('ano_min') anoMin?: string,
    @Query('ano_max') anoMax?: string,
    @Query('preco_min') precoMin?: string,
    @Query('preco_max') precoMax?: string,
    @Query('sort') sort?: string,
  ) {
    return this.vehiclesService.findAll({
      q,
      marca,
      modelo,
      tipo,
      anoMin: anoMin ? Number(anoMin) : undefined,
      anoMax: anoMax ? Number(anoMax) : undefined,
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      sort,
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.vehiclesService.findOne(slug); }

  @Post()
  create(@Body() data: any) { return this.vehiclesService.create(data); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.vehiclesService.update(Number(id), data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.vehiclesService.remove(Number(id)); }

  @Post('process')
  async processJson(@Query('url') url?: string, @Query('type') type?: string) {
    return this.stockSync.run(url, type);
  }
}
