import Image from "next/image";
import LoadingGif from "../../public/loading.gif";

export const Loading: React.FC = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      <Image src={LoadingGif} alt="Loading" width={200} />
    </div>
  );
};
