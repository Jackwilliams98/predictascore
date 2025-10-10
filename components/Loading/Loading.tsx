import Image from "next/image";
import LoadingGif from "../../public/loading.gif";
import classes from "./Loading.module.css";

interface LoadingProps {
  isCenterAligned?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ isCenterAligned }) => {
  return (
    <div className={isCenterAligned ? classes.centerAligned : ""}>
      <div className={classes.container}>
        <Image src={LoadingGif} alt="Loading" width={200} unoptimized />
      </div>
    </div>
  );
};
