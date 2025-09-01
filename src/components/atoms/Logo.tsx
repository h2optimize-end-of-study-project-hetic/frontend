import { useNavigate } from "react-router";
import logo from "../../assets/logo.svg";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <img
      src={logo}
      alt="Logo H₂Optimize"
      // style={{ width: 240, height: "auto" }}
      className="cursor-pointer w-[240px] h-auto"
      onClick={() => navigate("/dashboard")}
    />
  );
}
