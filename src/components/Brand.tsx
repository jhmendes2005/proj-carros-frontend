import Link from "next/link";
export default function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Bom Jesus Automóveis — início">
      <span className="brand-symbol" aria-hidden="true">
        <img src="/bomjesuslogo.png" alt="" width="100" height="100" />
      </span>
      <span className="brand-type">
        BOM JESUS<small>AUTOMÓVEIS</small>
      </span>
    </Link>
  );
}
