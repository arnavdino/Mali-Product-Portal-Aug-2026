import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
export interface PathsGuidProps {
  paths: { href: string; label: string }[];
}
export const PathsGuid: React.FC<PathsGuidProps> = ({ paths }) => {
  return (
    <div className="lg:ml-32 md:ml-16 ml-4  text-xl font-bold cursor-pointer flex flex-row">
      {paths.map((path, idx) => (
        <Link to={path.href}>
          <span className="text-blue-900 underline mr-6 flex flex-row">
            {path.label}{" "}
            {idx < paths.length - 1 && <FaArrowRight className="ml-4 mt-1" />}
          </span>
        </Link>
      ))}
    </div>
  );
};
