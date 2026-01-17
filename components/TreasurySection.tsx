
import React, { useState } from 'react';
import { TreasuryTransaction, TransactionType } from '../types';

interface TreasurySectionProps {
  transactions: TreasuryTransaction[];
  onAddTransaction: (transaction: Omit<TreasuryTransaction, 'id'>) => void;
  userName: string;
}

const TreasurySection: React.FC<TreasurySectionProps> = ({ transactions, onAddTransaction, userName }) => {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'history'>('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    if (viewMode === 'monthly') {
      return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
    } else {
      // Búsqueda en historial completo
      const search = searchTerm.toLowerCase();
      return t.description.toLowerCase().includes(search) || 
             t.recordedBy.toLowerCase().includes(search) ||
             t.type.toLowerCase().includes(search);
    }
  });

  const totals = (viewMode === 'monthly' ? filteredTransactions : transactions).reduce((acc, curr) => {
    if (curr.type === 'ENTRADA') acc.entradas += curr.amount;
    if (curr.type === 'DIEZMO') acc.diezmos += curr.amount;
    if (curr.type === 'GASTO') acc.gastos += curr.amount;
    return acc;
  }, { entradas: 0, diezmos: 0, gastos: 0 });

  const cajaActual = totals.entradas - totals.gastos - totals.diezmos;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onAddTransaction({
      type: formData.get('type') as TransactionType,
      amount: Number(formData.get('amount')),
      date: new Date().toISOString(),
      description: formData.get('description') as string,
      recordedBy: userName
    });
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount);
  };

  const downloadExcel = () => {
    const headers = "Fecha,Descripcion,Tipo,Monto,Registrado Por\n";
    const dataToExport = viewMode === 'monthly' ? filteredTransactions : transactions;
    const rows = dataToExport.map(t => 
      `${new Date(t.date).toLocaleDateString()},"${t.description}",${t.type},${t.amount},"${t.recordedBy}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const fileName = viewMode === 'monthly' ? `Tesoreria_${months[selectedMonth]}_${selectedYear}.csv` : 'Tesoreria_Historial_Completo.csv';
    link.download = fileName;
    link.click();
  };

  const downloadWord = () => {
    const dataToExport = viewMode === 'monthly' ? filteredTransactions : transactions;
    const title = viewMode === 'monthly' ? `${months[selectedMonth].toUpperCase()} ${selectedYear}` : 'HISTORIAL COMPLETO';
    
    const content = `
      RESUMEN DE TESORERIA - ${title}
      Misión de la Iglesia del Señor Malalhue
      --------------------------------------------------
      
      RESUMEN FINANCIERO TOTAL:
      - Entrada General: ${formatCurrency(totals.entradas)}
      - Diezmos (Egresados): ${formatCurrency(totals.diezmos)}
      - Gastos Varios: ${formatCurrency(totals.gastos)}
      
      SALDO FINAL EN CAJA: ${formatCurrency(cajaActual)}
      
      DETALLE DE MOVIMIENTOS (${dataToExport.length} registros):
      ${dataToExport.map(t => 
        `[${new Date(t.date).toLocaleDateString()}] ${t.type}: ${t.description} - ${formatCurrency(t.amount)}`
      ).join('\n')}
      
      --------------------------------------------------
      Documento generado automáticamente por el sistema.
    `;
    
    const blob = new Blob([content], { type: 'application/msword' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Informe_Tesoreria_${viewMode}.doc`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tesorería</h2>
          <div className="flex items-center gap-2 mt-2 bg-slate-100 p-1 rounded-xl w-fit">
            <button 
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === 'monthly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Vista Mensual
            </button>
            <button 
              onClick={() => setViewMode('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${viewMode === 'history' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Historial Completo
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
           <button 
            onClick={downloadExcel}
            className="bg-white border text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
          >
            📊 Excel
          </button>
          <button 
            onClick={downloadWord}
            className="bg-white border text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-2 shadow-sm"
          >
            📝 Word
          </button>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-700 transition"
          >
            {showForm ? 'Cerrar' : '+ Nuevo Registro'}
          </button>
        </div>
      </div>

      {viewMode === 'monthly' ? (
        <div className="bg-indigo-50/50 p-4 rounded-2xl flex items-center gap-4 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-900 uppercase">Filtrar Mes:</p>
          <div className="flex items-center gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm border border-indigo-200 bg-white rounded-lg px-3 py-1.5 font-bold text-indigo-600 outline-none"
            >
              {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm border border-indigo-200 bg-white rounded-lg px-3 py-1.5 font-bold text-indigo-600 outline-none"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar en todo el historial (descripción, tipo o responsable)..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Ingresos Totales</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.entradas)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-purple-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Diezmos Egresados</p>
          <p className="text-2xl font-bold text-purple-600">-{formatCurrency(totals.diezmos)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-bold text-slate-400 uppercase">Gastos Varios</p>
          <p className="text-2xl font-bold text-red-600">-{formatCurrency(totals.gastos)}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border shadow-lg border-l-4 border-l-emerald-400">
          <p className="text-xs font-bold text-slate-400 uppercase">Saldo Final en Caja</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(cajaActual)}</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-dashed border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Tipo de Movimiento</label>
            <select required name="type" className="border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800">
              <option value="ENTRADA">Entrada General</option>
              <option value="DIEZMO">Diezmo (Resta de Caja)</option>
              <option value="GASTO">Gasto / Egreso</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Monto ($)</label>
            <input required name="amount" type="number" min="0" placeholder="Ej: 50000" className="border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 ml-1">Observaciones / Detalle</label>
            <input required name="description" type="text" placeholder="Ej: Pago de luz, Diezmo Hno..." className="border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-slate-800" />
          </div>
          <div className="md:col-span-3 flex justify-end items-center gap-4">
            <p className="text-[10px] text-slate-400 italic">Fecha de registro: {new Date().toLocaleDateString()}</p>
            <button type="submit" className="bg-emerald-600 text-white px-8 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg">Finalizar Registro</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
            {viewMode === 'monthly' ? `Registros de ${months[selectedMonth]}` : 'Todos los Registros Históricos'}
          </h3>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">
            {filteredTransactions.length} Movimientos
          </span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Detalle</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">No se encontraron registros {viewMode === 'monthly' ? 'este mes' : 'con ese criterio'}.</td>
              </tr>
            ) : (
              filteredTransactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="font-medium">{new Date(t.date).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800">{t.description}</div>
                    <div className="flex gap-2 items-center mt-1">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        t.type === 'GASTO' || t.type === 'DIEZMO' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {t.type}
                      </span>
                      <span className="text-[10px] text-slate-400 italic truncate max-w-[100px]">Por: {t.recordedBy}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'GASTO' || t.type === 'DIEZMO' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {t.type === 'GASTO' || t.type === 'DIEZMO' ? '-' : '+'}{formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreasurySection;
