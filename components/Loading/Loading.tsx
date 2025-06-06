import Image from "next/image";
import LoadingGif from "../../public/loading.gif";

export const Loading: React.FC = () => {
  return <Image src={LoadingGif} alt="Loading" width={200} />;
};
