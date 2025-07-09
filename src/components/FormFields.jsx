// import { Input } from "@/components/ui/input";
// import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "./ui/Input";
import {Select, SelectItem} from "./ui/Select"

export const TextInput = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input {...props} className="w-full" />
  </div>
);

export const RoleSelect = ({ value, onValueChange }) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="regular">Regular</SelectItem>
  </Select>
);
