
import ClipLoader from "react-spinners/ClipLoader";

interface SpinnerProps {
    loading: boolean,
    color?: string,
    size?: number
}


export const AppSpinner: React.FC<SpinnerProps> = ({ loading = false, color = "black", size = 150 }) => {
    return (
        <div className={`${loading?"spinner_parent":""}`}>
        <ClipLoader color={color} loading={loading} size={size} />
        </div>
    );
}