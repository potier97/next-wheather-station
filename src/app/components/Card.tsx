import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { track } from '@vercel/analytics';
import { useEffect } from 'react';

const Card = (props: any) => {
    // Determinar si el valor es válido o N/A
    const isDataValid = props.value !== "N/A" && props.value !== null && props.value !== undefined;
    
    // Función para formatear valores largos
    const formatValue = (value: any) => {
      if (value === "N/A" || value === null || value === undefined) {
        return "N/A";
      }
      
      // Si es un string muy largo (como coordenadas), formatear
      const stringValue = String(value);
      if (stringValue.length > 12) {
        // Para coordenadas, dividir en dos líneas y limitar decimales
        if (stringValue.includes(',')) {
          const parts = stringValue.split(',');
          if (parts.length === 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            return (
              <div className="flex flex-col leading-tight space-y-0.5">
                <span className="text-xs sm:text-sm font-mono">{lat.toFixed(4)}</span>
                <span className="text-xs sm:text-sm font-mono">{lng.toFixed(4)}</span>
              </div>
            );
          }
        }
        // Para otros textos largos, truncar con ellipsis
        return stringValue.length > 15 ? `${stringValue.substring(0, 12)}...` : stringValue;
      }
      
      return value;
    };

    // Verificar si es coordenadas para layout especial
    const isCoordinates = String(props.value).includes(',') && String(props.value).length > 12;

    // Track de interacción hover con la card
    const handleCardHover = () => {
      track('sensor_card_hover', {
        sensor_type: props.title.toLowerCase(),
        has_data: isDataValid,
        device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
        timestamp: new Date().toISOString()
      });
    };

    // Track cuando se hace click en la card (aunque no tenga función específica)
    const handleCardClick = () => {
      track('sensor_card_click', {
        sensor_type: props.title.toLowerCase(),
        has_data: isDataValid,
        data_value: isDataValid ? String(props.value) : 'N/A',
        timestamp: new Date().toISOString()
      });
    };

    // Ejecutar tracking de vista al montar el componente
    useEffect(() => {
      track('sensor_card_view', {
        sensor_type: props.title.toLowerCase(),
        has_data: isDataValid,
        data_value: isDataValid ? String(props.value) : 'N/A',
        measurement_unit: props.measure || 'none',
        timestamp: new Date().toISOString()
      });
    }, [props.value, props.title, isDataValid, props.measure]);
    
    return (
      <div 
        className="group relative w-full h-48 sm:h-52 max-w-sm mx-auto sm:max-w-none p-4 sm:p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden touch-manipulation cursor-pointer"
        onMouseEnter={handleCardHover}
        onClick={handleCardClick}
      >
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-blue-900/20 group-hover:via-purple-900/20 group-hover:to-transparent transition-all duration-500 rounded-2xl"></div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-100 mb-1" style={{color: props.color}}>{props.title}</h2>
            <div className="text-xs text-gray-400 opacity-80 px-1 line-clamp-2">{props.description}</div>
          </div>
          
          {/* Icon */}
          <div className="flex justify-center items-center mb-3 sm:mb-4">
            <div className="relative">
              {/* Icon background glow */}
              <div className="absolute inset-0 rounded-full blur-lg opacity-30" style={{backgroundColor: props.color}}></div>
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-500">
                <FontAwesomeIcon 
                  color={props.color}
                  icon={props.icon} 
                  className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110"
                  fixedWidth
                />
              </div>
            </div>
          </div>
          
          {/* Value - Flex grow to take remaining space */}
          <div className="text-center flex-1 flex flex-col justify-center">
            <div className="relative">
              <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wider overflow-hidden">
                {isCoordinates ? (
                  // Para coordenadas: formato especial en dos líneas
                  <div className="flex flex-col items-center">
                    {formatValue(props.value)}
                  </div>
                ) : (
                  // Para valores normales: valor y unidad en la misma línea
                  <div className="flex items-baseline justify-center space-x-1">
                    <span>{formatValue(props.value)}</span>
                    {props.measure && (
                      <span className="text-sm font-medium text-gray-400">{props.measure}</span>
                    )}
                  </div>
                )}
              </div>
              {/* Animated underline */}
              <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 mx-auto mt-2"></div>
            </div>
          </div>
          
          {/* Status indicator - Red if N/A, Green if valid data */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse shadow-lg ${
              isDataValid 
                ? 'bg-green-400 shadow-green-400/50' 
                : 'bg-red-400 shadow-red-400/50'
            }`}></div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;