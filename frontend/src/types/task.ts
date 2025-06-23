export interface Task {
  id: string;
  title: string;
}

export interface TodoFormProps {
  onAdd: (title: string) => void;
}
