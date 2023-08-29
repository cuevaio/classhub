"use client";
import { useParams } from "next/navigation";

const LoadingPage = () => {
  let params = useParams();
  let id = params.id;

  return (
    <div>
      <h1>Loading status {id}</h1>
    </div>
  );
};

export default LoadingPage;
