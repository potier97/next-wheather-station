import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = (props: any) => {
    return (
      <div className="w-full max-w-sm md:max-w-md p-10 rounded-xl shadow-lg bg-gray-200 mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700" style={{color: props.color}}>{props.title}</h2>
          <div className="text-xs text-gray-500">Current {props.description}</div>
          <div className="flex justify-center items-center mt-4">
          <FontAwesomeIcon 
            color={props.color}
            icon={props.icon} 
            className="w-4 h-4 mr-2 text-secondary"
            fixedWidth
            fontSize={20}
            bounce/>
          </div>
        </div>
        <div className="p-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800">{props.value} {props.measure}</h2>
        </div>
      </div>
    );
  };
  
  export default Card;