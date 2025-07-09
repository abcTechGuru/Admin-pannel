import { Button } from "@/components/ui/button";

const MyButton = ({ label, onClick, variant = "default" }) => (
  <Button onClick={onClick} variant={variant} className="px-4 py-2">
    {label}
  </Button>
);

export default MyButton;
