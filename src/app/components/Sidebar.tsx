import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export interface NodeProps {
    name: string;
    id: number;
    x: number;
}

//@lint-ignore-every UNCOMMENTED_SHOULD_BE_REMOVED
const Sidebar = (props: any) => {
  return (
    <div className="w-64 p-6 h-screen overflow-auto border-r border-gray-700 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Nodes</h2>
      <div className="space-y-2">
        {props.nodeData.map((data: any, index: number) => (
          <div
            key={index}
            className="flex items-center p-2 border border-gray-700 rounded cursor-pointer"
            onClick={() => props.onNodeSelect(data)}
          >
            <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
            {`Node ${index + 1}`}
          </div>
        ))}
      </div>
      <div className="mt-auto mb-4 flex items-center">
        {/* Agrega funcionalidad de cambio de tema aquí */}

      </div>
    </div>
  );
};

export default Sidebar;