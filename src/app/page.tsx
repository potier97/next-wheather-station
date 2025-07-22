'use client'
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Card from '@/components/Card';
import Footer from '@/components/Footer';
import { faTemperature0, faDroplet, faLightbulb, faLocationDot, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ref, db, onValue } from "@/utils/config";
import { track } from '@vercel/analytics';

export interface NodeInterface {
  [key: string]: NodeSelectedInterface;
}

export interface NodeSelectedInterface {
  dateTime: string;
  hum: number;
  light: number;
  temp: number;
  location: {
    lat: number;
    lng: number;
  };
}

export default function Home() {

  const [nodeName, setNodeName] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NodeSelectedInterface>();
  const [nodes, setNodes] = useState<NodeInterface[]>([]);

  // Función para capitalizar texto
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nodesRef = ref(db, 'nodes');
        const unsubscribe = onValue(nodesRef, (snapshot) => {
          const data = snapshot.val();
          setNodes(data);
          if (nodeName?.length > 0) {
            const selectedNode: NodeSelectedInterface = data[nodeName as any] as any;
            if (selectedNode) {
              setSelectedNode(() => selectedNode);
            }
          }
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching data:', error);
        // Track de errores de conexión
        track('database_error', {
          error: 'firebase_connection_failed',
          timestamp: new Date().toISOString()
        });
      }
    };
    fetchData();
  }, [nodeName]);

  const formatDateTime = (dateTimeString: string) => {
    try {
      let date: Date;
      
      if (dateTimeString.includes(' ')) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const [day, month, yearStr] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');
        
        let year: number;
        if (yearStr.length === 2) {
          year = 2000 + parseInt(yearStr);
        } else {
          year = parseInt(yearStr);
        }
        
        date = new Date(year, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
      } else {
        date = new Date(dateTimeString);
      }

      if (isNaN(date.getTime())) {
        return {
          date: dateTimeString,
          time: '',
          relative: 'Formato no válido'
        };
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };

      const formattedDate = date.toLocaleDateString('es-ES', dateOptions);
      const formattedTime = date.toLocaleTimeString('es-ES', timeOptions);

      let relative = '';
      if (diffMinutes < 1) {
        relative = 'Hace un momento';
      } else if (diffMinutes < 60) {
        relative = `Hace ${diffMinutes} min`;
      } else if (diffHours < 24) {
        relative = `Hace ${diffHours}h`;
      } else if (diffDays < 7) {
        relative = `Hace ${diffDays} días`;
      } else {
        relative = 'Hace más de una semana';
      }

      return {
        date: formattedDate,
        time: formattedTime,
        relative: relative
      };
    } catch (error) {
      return {
        date: dateTimeString,
        time: '',
        relative: 'Error al procesar fecha'
      };
    }
  };
 

  const handleNodeSelect = (selected: any) => {
    const selectedNode: NodeSelectedInterface = nodes[selected] as any;
    if (selectedNode) {
      setNodeName(selected);
      setSelectedNode(selectedNode);
      
      // Track de selección de nodos
      track('node_selected', {
        node_id: selected,
        timestamp: new Date().toISOString(),
        has_temperature: selectedNode.temp !== undefined && selectedNode.temp !== null,
        has_humidity: selectedNode.hum !== undefined && selectedNode.hum !== null,
        has_light: selectedNode.light !== undefined && selectedNode.light !== null,
        has_location: selectedNode.location && 
                     selectedNode.location.lat !== undefined && 
                     selectedNode.location.lng !== undefined,
        data_freshness: selectedNode.dateTime
      });
    }
  };

  // Track de la carga inicial de la página
  useEffect(() => {
    track('dashboard_loaded', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex flex-1 min-h-0">
        <Sidebar nodeData={nodes} onNodeSelect={handleNodeSelect} />
        
        <div className="flex flex-col w-full md:w-auto flex-1 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-60 h-60 md:w-80 md:h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-60 h-60 md:w-80 md:h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 md:w-96 md:h-96 bg-green-600/10 rounded-full blur-3xl animate-spin-slow"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 flex-shrink-0">
            <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex items-center space-x-3 sm:space-x-4 ml-16 md:ml-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-sm"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    IoT Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">Sistema de Monitoreo Ambiental</p>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {selectedNode ? (
              <div className="max-w-7xl mx-auto">
                {/* Node info */}
                <div className="mb-6 lg:mb-8">
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Node {capitalize(nodeName)}</h2>
                        <p className="text-sm sm:text-base text-gray-400 mb-3">Monitoreo en tiempo real de sensores ambientales</p>
                        
                        {/* Fecha formateada */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
                              <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-blue-400 font-semibold">ÚLTIMA SINCRONIZACIÓN</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                                  <span className="text-sm font-medium text-white">
                                    {formatDateTime(selectedNode.dateTime).date}
                                  </span>
                                  <span className="text-sm text-blue-300">
                                    {formatDateTime(selectedNode.dateTime).time}
                                  </span>
                                  <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
                                    {formatDateTime(selectedNode.dateTime).relative}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sensor cards grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 justify-center items-start'>
                  <Card
                    title="Temperatura"
                    description="Medición actual de temperatura"
                    color="#3b82f6"
                    icon={faTemperature0}
                    measure={"°C"}
                    value={selectedNode.temp !== undefined && selectedNode.temp !== null ? selectedNode.temp : "N/A"} 
                    />
                  <Card 
                    title="Humedad"
                    description="Niveles de humedad relativa"
                    color="#22c55e"
                    icon={faDroplet}
                    measure={"%"}
                    value={selectedNode.hum !== undefined && selectedNode.hum !== null ? selectedNode.hum : "N/A"} 
                    />
                  <Card 
                    title="Iluminación"
                    description="Intensidad lumínica detectada"
                    color="#eab308"
                    icon={faLightbulb}
                    measure={"lux"}
                    value={selectedNode.light !== undefined && selectedNode.light !== null ? selectedNode.light : "N/A"} />
                  <Card 
                    title="Ubicación"
                    description="Coordenadas GPS del sensor"
                    color="#ef4444"
                    icon={faLocationDot}
                    measure={""}
                    value={
                      selectedNode.location && 
                      selectedNode.location.lat !== undefined && 
                      selectedNode.location.lng !== undefined &&
                      selectedNode.location.lat !== null && 
                      selectedNode.location.lng !== null
                        ? `${selectedNode.location.lat}, ${selectedNode.location.lng}` 
                        : "N/A"
                    } />
                </div>
              </div>
            ): (
              <div className="flex items-center justify-center h-full min-h-[50vh]">
                <div className="text-center max-w-sm sm:max-w-md mx-auto px-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4">Selecciona un Nodo IoT</h1>
                  <p className="text-gray-400 text-base sm:text-lg">Elige un sensor de la lista para visualizar sus datos en tiempo real</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer - always visible */}
      <Footer />
    </div>
  )
}
