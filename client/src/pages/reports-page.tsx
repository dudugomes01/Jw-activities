
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Activity, UserRole } from "@shared/schema";
// import { Header } from "@/components/layout/header";
// import { NavigationBar } from "@/components/layout/navigation-bar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { calculateHoursByType } from "@/lib/utils/activity-utils";

// export default function ReportsPage() {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   const { data: activities = [] } = useQuery<Activity[]>({
//     queryKey: ["/api/activities/month", selectedYear, selectedMonth],
//     queryFn: async () => {
//       const response = await fetch(`/api/activities/month/${selectedYear}/${selectedMonth}`);
//       if (!response.ok) throw new Error("Failed to fetch activities");
//       return response.json();
//     },
//   });

//   const months = [
//     "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
//     "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
//   ];

//   const years = [2023, 2024, 2025];

//   // Prepare data for chart
//   const hoursByType = calculateHoursByType(activities);
//   const chartData = Object.entries(hoursByType).map(([type, hours]) => ({
//     type: type === 'campo' ? 'Campo' : 
//           type === 'testemunho' ? 'Testemunho' :
//           type === 'cartas' ? 'Cartas' : 'Estudo',
//     hours
//   }));

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />
//       <NavigationBar />
      
//       <main className="flex-1 overflow-y-auto bg-gray-50">
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
//           <Card>
//             <CardContent className="pt-6">
//               <h2 className="text-2xl font-bold leading-7 text-gray-900 mb-6">
//                 Resumo de Relatórios
//               </h2>
              
//               <div className="flex gap-4 mb-6">
//                 <Select 
//                   value={selectedYear.toString()} 
//                   onValueChange={(value) => setSelectedYear(Number(value))}
//                 >
//                   <SelectTrigger className="w-32">
//                     <SelectValue placeholder="Ano" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {years.map((year) => (
//                       <SelectItem key={year} value={year.toString()}>
//                         {year}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select 
//                   value={selectedMonth.toString()} 
//                   onValueChange={(value) => setSelectedMonth(Number(value))}
//                 >
//                   <SelectTrigger className="w-40">
//                     <SelectValue placeholder="Mês" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {months.map((month, index) => (
//                       <SelectItem key={index} value={index.toString()}>
//                         {month}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="mt-6 space-y-6">
//                 <div className="bg-white p-6 rounded-lg shadow-sm border">
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">Total de Horas no Mês</h3>
//                   <p className="text-4xl font-bold text-primary">
//                     {activities.reduce((total, activity) => total + Number(activity.hours), 0)}h
//                   </p>
//                 </div>

//                 <h3 className="text-lg font-medium mb-4">Horas por Tipo de Atividade</h3>
//                 <div className="h-80 w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={chartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="type" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="hours" fill="#4F46E5" name="Horas" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <h3 className="text-lg font-medium mb-4">Detalhes das Atividades</h3>
//                 <div className="space-y-4">
//                   {activities.map((activity) => (
//                     <div key={activity.id} className="bg-white p-4 rounded-lg shadow">
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-medium">{activity.type === 'campo' ? 'Campo' : 
//                                                      activity.type === 'testemunho' ? 'Testemunho' :
//                                                      activity.type === 'cartas' ? 'Cartas' : 'Estudo'}</p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(activity.date).toLocaleDateString('pt-BR')}
//                           </p>
//                         </div>
//                         <div className="text-lg font-semibold">
//                           {activity.hours}h
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, UserRole } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { calculateHoursByType } from "@/lib/utils/activity-utils";

export default function ReportsPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [serviceYear, setServiceYear] = useState(currentDate.getFullYear() - (currentDate.getMonth() < 8 ? 1 : 0));

  // Consulta para dados mensais
  const { data: activities = [], isLoading: isLoadingMonthly } = useQuery<Activity[]>({
    queryKey: ["/api/activities/month", selectedYear, selectedMonth],
    queryFn: async () => {
      const response = await fetch(`/api/activities/month/${selectedYear}/${selectedMonth}`);
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json();
    },
  });

  // Para relatório anual, definimos explicitamente os meses necessários
  const monthRanges = useMemo(() => {
    const ranges = [];
    for (let i = 0; i < 12; i++) {
      const monthIndex = (8 + i) % 12; // Começando em setembro (8)
      const year = monthIndex < 8 ? serviceYear + 1 : serviceYear;
      ranges.push({ month: monthIndex, year });
    }
    return ranges;
  }, [serviceYear]);

  // Agora vamos consultar cada mês individualmente
  const { data: yearlyData = [], isLoading: isLoadingYearly } = useQuery({
    queryKey: ["yearlyActivities", serviceYear],
    queryFn: async () => {
      // Preparar estrutura para os 12 meses
      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      
      const monthlyData = monthRanges.map(({ month, year }) => ({
        month: months[month],
        monthIndex: month,
        year,
        hours: 0,
        isCurrentMonth: month === currentDate.getMonth() && year === currentDate.getFullYear(),
        activities: [] // Armazenaremos as atividades aqui
      }));
      
      // Buscar dados para cada mês em paralelo
      await Promise.all(monthRanges.map(async ({ month, year }, index) => {
        try {
          const response = await fetch(`/api/activities/month/${year}/${month}`);
          if (response.ok) {
            const data = await response.json();
            // Armazenar as atividades
            monthlyData[index].activities = data;
            // Calcular o total de horas
            monthlyData[index].hours = data.reduce((sum: number, activity: { hours: any; }) => sum + Number(activity.hours), 0);
          }
        } catch (error) {
          console.error(`Erro ao buscar atividades de ${month}/${year}:`, error);
        }
      }));
      
      return monthlyData;
    },
    refetchOnWindowFocus: false,
  });

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const years = [2023, 2024, 2025];
  const serviceYears = [2023, 2024, 2025];

  // Preparação dos dados mensais
  const hoursByType = calculateHoursByType(activities);
  const chartData = Object.entries(hoursByType).map(([type, hours]) => ({
    type: type === 'campo' ? 'Campo' : 
          type === 'testemunho' ? 'Testemunho' :
          type === 'cartas' ? 'Cartas' : 'Estudo',
    hours
  }));

  // Calcular o total de horas do ano de serviço usando os dados do yearlyData
  const totalYearlyHours = useMemo(() => {
    return yearlyData.reduce((total, month) => total + month.hours, 0);
  }, [yearlyData]);

  // Para depuração
  useEffect(() => {
    console.log("Dados mensais:", activities);
    console.log("Dados do ano de serviço:", yearlyData);
    console.log("Total de horas no ano:", totalYearlyHours);
  }, [activities, yearlyData, totalYearlyHours]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
          {/* Monthly Report Card */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 mb-6">
                Resumo de Relatórios Mensais
              </h2>
              
              <div className="flex gap-4 mb-6">
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(Number(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Total de Horas no Mês</h3>
                  <p className="text-4xl font-bold text-primary">
                    {isLoadingMonthly ? "..." : activities.reduce((total, activity) => total + Number(activity.hours), 0)}h
                  </p>
                </div>

                <h3 className="text-lg font-medium mb-4">Horas por Tipo de Atividade</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#4F46E5" name="Horas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Detalhes das Atividades</h3>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{activity.type === 'campo' ? 'Campo' : 
                                                     activity.type === 'testemunho' ? 'Testemunho' :
                                                     activity.type === 'cartas' ? 'Cartas' : 'Estudo'}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-lg font-semibold">
                          {activity.hours}h
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yearly Report Card - New Section */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 mb-6">
                Relatório do Ano de Serviço ({serviceYear}-{serviceYear + 1})
              </h2>
              
              <div className="flex gap-4 mb-6">
                <Select 
                  value={serviceYear.toString()} 
                  onValueChange={(value) => setServiceYear(Number(value))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ano de Serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}-{year + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Botão de sincronização para depuração */}
                <button 
                  onClick={() => {
                    // Força uma refetch usando o React Query
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-md text-sm border hover:bg-gray-200"
                >
                  Atualizar dados
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Total de Horas no Ano de Serviço</h3>
                  <p className="text-4xl font-bold text-primary">
                    {isLoadingYearly ? "..." : totalYearlyHours}h
                  </p>
                </div>

                <h3 className="text-lg font-medium mb-4">Horas por Mês (Setembro a Agosto)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} horas`, 'Total']}
                        labelFormatter={(label) => {
                          const monthData = yearlyData.find(m => m.month === label);
                          return `${label} ${monthData ? monthData.year : ''}`;
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#4F46E5" 
                        strokeWidth={2} 
                        name="Horas" 
                        dot={{ r: 4, fill: "#4F46E5" }}
                        activeDot={{ r: 6, stroke: "#4338CA", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Resumo Mensal do Ano de Serviço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {yearlyData.map((monthData, index) => (
                    <div 
                      key={index} 
                      className={`bg-white p-4 rounded-lg shadow ${monthData.isCurrentMonth ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{monthData.month}</p>
                          {monthData.isCurrentMonth && (
                            <p className="text-sm text-primary font-medium">
                              Mês Atual
                            </p>
                          )}
                          <p className="text-xs text-gray-400">{monthData.year}</p>
                        </div>
                        <div className="text-lg font-semibold">
                          {monthData.hours}h
                        </div>
                      </div>
                      
                      {/* Mostrar detalhes das atividades ao expandir (opcional) */}
                      {monthData.activities && monthData.activities.length > 0 && (
                        <div className="mt-2 pt-2 border-t text-sm">
                          <p className="text-xs text-gray-500 mb-1">
                            {monthData.activities.length} atividade(s) registrada(s)
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}