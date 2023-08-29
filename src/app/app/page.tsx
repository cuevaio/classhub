import { Suspense } from "react";
import { Content } from "./content";

const AppPage = () => (
  <div className="container pt-6">
    <h1 className="text-4xl font-bold text-primary mb-4">Classhub!</h1>
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  </div>
);

export default AppPage;
