import * as React from "react";
import { CreateStatusForm } from "./create-status-form";

const CreateStatusPage = () => {
  return (
    <div className="container flex items-center justify-center">
      <div className="p-8 rounded-lg border sm:w-1/2">
        <h1 className="text-2xl font-bold mb-4">Nuevo estado</h1>
        <CreateStatusForm />
      </div>
    </div>
  );
};

export default CreateStatusPage;
