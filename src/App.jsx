import { useState } from 'react';
import { CCAA_DATA } from './data/ccaaData';
import { Car, Bike, Calculator, Check, Copy, Shield, FileText } from 'lucide-react';

// Ordenamos alfabéticamente las Comunidades Autónomas por su nombre
const SORTED_CCAA = [...CCAA_DATA].sort((a, b) => a.name.localeCompare(b.name, 'es'));

export default function App() {
  const [vehicleType, setVehicleType] = useState('coche');
  // Selecciona por defecto la primera CCAA alfabéticamente (Andalucía)
  const [ccaaId, setCcaaId] = useState(SORTED_CCAA[0].id);
  // Estado vacío por defecto para que 7500 sea solo un placeholder que no afecta el cálculo
  const [price, setPrice] = useState('');
  const [copied, setCopied] = useState(false);

  // Estado inicial del cálculo
  const [result, setResult] = useState({
    itpTax: 0,
    totalCost: 55.70,
    ccaaName: SORTED_CCAA[0].name,
    ccaaItp: SORTED_CCAA[0].itp,
    calculated: false
  });

  // Tasa fija DGT instantánea según selección de vehículo
  const dgtFee = vehicleType === 'ciclomotor' ? 27.57 : 55.70;

  // Manejador del botón "Calcular Traspaso"
  const handleCalculate = (e) => {
    e?.preventDefault();
    const selectedCcaa = SORTED_CCAA.find((c) => c.id === ccaaId) || SORTED_CCAA[0];
    const numPrice = parseFloat(price) || 0;
    const itpTax = numPrice > 0 ? numPrice * (selectedCcaa.itp / 100) : 0;

    setResult({
      itpTax,
      totalCost: dgtFee + itpTax,
      ccaaName: selectedCcaa.name,
      ccaaItp: selectedCcaa.itp,
      calculated: true
    });
  };

  const handleCopy = () => {
    const text = `Resumen Traspaso Vehículo:\n• Tasa DGT: ${dgtFee.toFixed(2)}€\n• ITP (${result.ccaaName} ${result.ccaaItp}%): ${result.itpTax.toFixed(2)}€\nTotal estimado: ${(dgtFee + result.itpTax).toFixed(2)}€\nCalculado en CalculaTuTraspaso.es`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-blue-950 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-xl tracking-tight text-white">
              CalculaTuTraspaso<span className="text-emerald-400">.es</span>
            </span>
          </div>
          <span className="text-xs bg-blue-900 text-blue-200 px-3 py-1 rounded-full font-medium border border-blue-800">
            DGT e ITP 2026
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full">
        
        {/* TÍTULO PRINCIPAL */}
        <div className="text-center mb-8">
          <h1 
            style={{ color: '#0f172a' }} 
            className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight"
          >
            Calculadora de Traspaso de Vehículos
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium">
            Calcula la Tasa DGT y el Impuesto ITP por Comunidad Autónoma en segundos.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <section className="md:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            
            <h2 
              style={{ color: '#0f172a' }} 
              className="text-lg font-bold mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-blue-900" />
              <span>Datos del Vehículo</span>
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              
              {/* Seleccionar Tipo de Vehículo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Vehículo
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'coche', label: 'Coche / Van', Icon: Car },
                    { id: 'moto', label: 'Moto', Icon: Bike },
                    { id: 'ciclomotor', label: 'Ciclomotor', Icon: Bike },
                  ].map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setVehicleType(id)}
                      className={`p-3 text-center rounded-xl border transition flex flex-col items-center justify-center cursor-pointer ${
                        vehicleType === id
                          ? 'border-blue-900 bg-blue-50 text-blue-950 font-bold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-1 text-slate-800" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comunidad Autónoma (Ordenada Alfabéticamente) */}
              <div>
                <label htmlFor="ccaa" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Comunidad Autónoma del Comprador
                </label>
                <select
                  id="ccaa"
                  value={ccaaId}
                  onChange={(e) => setCcaaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-medium rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-900 focus:bg-white outline-none transition"
                >
                  {SORTED_CCAA.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.itp}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Precio de Venta (7500 como placeholder de sugerencia) */}
              <div>
                <label htmlFor="price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Precio Acordado de Venta (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="7500"
                    min="0"
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-semibold rounded-xl p-3 pl-4 pr-8 text-sm focus:ring-2 focus:ring-blue-900 focus:bg-white outline-none transition"
                  />
                  <span className="absolute right-3 top-3 text-slate-500 font-bold">€</span>
                </div>
              </div>

              {/* BOTÓN DE CÁLCULO */}
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition duration-150 ease-in-out flex items-center justify-center space-x-2 text-sm cursor-pointer mt-2"
              >
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>Calcular Traspaso</span>
              </button>

            </form>
          </section>

          {/* Resultado y Monetización */}
          <section className="md:col-span-5 flex flex-col space-y-4">
            
            <div className="bg-slate-950 text-white p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">
                  Resumen del Cálculo
                </h2>

                <div className="mb-6">
                  <span className="text-xs text-slate-400 block mb-1">Coste Total Estimado</span>
                  <div className="text-4xl font-black text-emerald-400">
                    {(dgtFee + result.itpTax).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-4 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Tasa Fija DGT:</span>
                    <span className="font-semibold text-white">{dgtFee.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Impuesto ITP ({result.ccaaItp}%):</span>
                    <span className="font-semibold text-white">{result.itpTax.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-6 w-full font-semibold py-3 px-3 rounded-xl border text-xs transition flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100 cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar Resumen para WhatsApp'}</span>
              </button>
            </div>

            {/* Banner Afiliado */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-100 border border-blue-200 p-4 rounded-2xl shadow-sm">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-900 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    ¿Vas a comprar este vehículo?
                  </h3>
                  <p className="text-xs text-slate-700 mt-1">
                    Compara seguros a terceros/todo riesgo en 1 minuto.
                  </p>
                  <a href="#" target="_blank" rel="noreferrer" className="inline-block mt-2 text-xs font-bold text-blue-900 hover:underline">
                    Ver ofertas de seguro →
                  </a>
                </div>
              </div>
            </div>

          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-center py-4 text-xs text-slate-600 font-medium">
        <p>© 2026 CalculaTuTraspaso.es — Herramienta informativa no vinculante.</p>
      </footer>

    </div>
  );
}