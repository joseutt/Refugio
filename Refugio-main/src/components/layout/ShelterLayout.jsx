import ShelterHeader from "@/components/layout/ShelterHeader";
import { Outlet } from "react-router-dom";

const ShelterLayout = () => {
  return (
    <>
      <ShelterHeader />
      <main className="min-h-screen bg-muted/30">
        <Outlet />
      </main>
    </>
  );
};

export default ShelterLayout;