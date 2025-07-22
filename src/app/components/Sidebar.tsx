import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrochip, faWifi, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { track } from '@vercel/analytics';

interface SidebarProps {
  nodeData: any;
  onNodeSelect: (node: string) => void;
}

const Sidebar = (props: SidebarProps) => {
  const [keys, setKey] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para capitalizar texto
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  useEffect(() => {
    const keysName = Object.keys(props.nodeData);
    setKey(keysName);
    
    // Track cuando se cargan nuevos nodos
    if (keysName.length > 0) {
      track('nodes_loaded', {
        total_nodes: keysName.length,
        node_ids_count: keysName.length,
        first_node: keysName[0] || 'none',
        timestamp: new Date().toISOString()
      });
    }
  }, [props.nodeData]);

  const handleNodeClick = (data: string) => {
    setSelectedNode(data);
    props.onNodeSelect(data);
    
    // Track de interacción con nodos
    track('sidebar_node_click', {
      node_id: data,
      previous_node: selectedNode,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
      timestamp: new Date().toISOString()
    });
    
    // Cerrar menú móvil después de seleccionar
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      
      // Track de cierre automático del menú
      track('mobile_menu_auto_close', {
        node_selected: data,
        timestamp: new Date().toISOString()
      });
    }
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Track de interacciones con el menú móvil
    track('mobile_menu_toggle', {
      action: newState ? 'open' : 'close',
      current_node: selectedNode,
      total_nodes: keys.length,
      timestamp: new Date().toISOString()
    });
  };

  const handleOverlayClick = () => {
    setIsMobileMenuOpen(false);
    
    // Track de cierre por overlay
    track('mobile_menu_overlay_close', {
      current_node: selectedNode,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <FontAwesomeIcon 
          icon={isMobileMenuOpen ? faTimes : faBars} 
          className="w-5 h-5" 
        />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-40 md:z-auto
        w-80 md:w-80 h-screen 
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 
        border-r border-gray-700 
        flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-hidden
      `}>
        {/* Background tech pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-purple-500 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative z-10 p-4 md:p-6 pb-16 md:pb-6 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faMicrochip} className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                IoT Nodes
              </h2>
            </div>
            <div className="h-px bg-gradient-to-r from-blue-500 via-purple-500 to-transparent"></div>
          </div>

          {/* Nodes list */}
          <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto overflow-x-hidden">
            {keys.length > 0 ? (
              keys.map((data: string, index: number) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedNode === data 
                      ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-blue-500/50 shadow-lg shadow-blue-500/20' 
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 hover:shadow-lg hover:shadow-gray-600/20'
                  } border border-gray-600 hover:border-gray-500 active:scale-95`}
                  onClick={() => handleNodeClick(data)}
                  onMouseEnter={() => {
                    // Track de hover en nodos (solo en desktop)
                    if (window.innerWidth >= 768) {
                      track('node_hover', {
                        node_id: data,
                        device_type: 'desktop',
                        timestamp: new Date().toISOString()
                      });
                    }
                  }}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex items-center p-3 md:p-4">
                    <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-500 mr-3 md:mr-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <FontAwesomeIcon 
                        icon={faWifi} 
                        className={`w-3 h-3 md:w-4 md:h-4 transition-colors duration-300 ${
                          selectedNode === data ? 'text-blue-400' : 'text-gray-300 group-hover:text-blue-400'
                        }`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm md:text-base transition-colors duration-300 truncate ${
                        selectedNode === data ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'
                      }`}>
                        Node {capitalize(data)}
                      </h3>
                      <p className="text-xs text-gray-400">Estación de Sensores</p>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedNode === data && (
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 md:py-8">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faMicrochip} className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm">No se detectaron nodos</p>
                <p className="text-gray-500 text-xs mt-1">Esperando dispositivos IoT...</p>
              </div>
            )}
          </div>

          {/* Footer info */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 mb-20 md:mb-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-3 md:p-4 border border-gray-600">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Total de Nodos</p>
                  <p className="text-xl md:text-2xl font-bold text-white">{keys.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;