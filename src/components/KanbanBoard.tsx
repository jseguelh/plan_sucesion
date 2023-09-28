import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import data from "./resumen.json";

const defaultTasksBottom = data.map(item => ({
  id: item.Sap.toString(),
  columnId: "staticBottom",
  content: item.Nombre,
  data: item  // Almacena todo el objeto de datos aquí
}));

const defaultCols: Column[] = [
  
  {
    id: "gop",
    title: "Gerente Operaciones",

  },
  {
    id: "gsso",
    title: "Gerente de Seguridad y Salud Ocupacional",
  },
  {
    id: "ggp",
    title: "Gerente Gestion de Personas",
  },
  {
    id: "gad",
    title: "Gerente de Administración",
  },
  {
    id: "ghc",
    title: "Gerente Hospital del Cobre",
  },
  {
    id: "grmd",
    title: "Gerente Recursos Mineros y Desarrollo",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "gop",
    content:
      "RENÉ GALLEGUILLOS",
  },
  {
    id: "2",
    columnId: "gsso",
    content:
      "HIPOLITO HURTADO",
  },
  {
    id: "3",
    columnId: "gad",
    content: "RODRIGO VIDAL",
  },
  {
    id: "4",
    columnId: "grmd",
    content: "JUAN CRISTOBAL VIDELA",
  },
  {
    id: "5",
    columnId: "ggp",
    content: "MARCOS SANTANDER",
  },
{
  id: "666",
  columnId: "ghc",
  content: "MÓNICA JIMENEZ",
},
  
  
];


const staticColumnBottom: Column = {
  id: "staticBottom",
  title: "Profesionales",
};


const staticColumn: Column = {
  id: "static",
  title: "Gerencia General",
};

const defaultTasksstatic: Task[] = [
  {
    id: "staticTask5",
    columnId: "static",
    content: "CHRISTIAN CAVIEDES",
  },
];


function KanbanBoard() {

   
  //const savedColumns = localStorage.getItem('kanbanColumns');
  //const savedTasks = localStorage.getItem('kanbanTasks');

  //const initialColumns = savedColumns ? JSON.parse(savedColumns) : defaultCols;

  //const initialTasks = savedTasks ? JSON.parse(savedTasks) : defaultTasks.concat(defaultTasksBottom);

  const [columns, setColumns] = useState<Column[]>(defaultCols);

  
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks.concat(defaultTasksBottom,defaultTasksstatic));

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

 
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div className="justify-center">
            {/* Aquí el encabezado estático */}
      <div className="mb-4 flex justify-center h-[200px] overflow-hidden">
        <ColumnContainer
          key={staticColumn.id}
          column={staticColumn}
          updateColumn={updateColumn}
          createTask={createTask}
          deleteTask={deleteTask}
          updateTask={updateTask}
          tasks={tasks.filter((task) => task.columnId === staticColumn.id)}
          deleteColumn={function (_id: Id): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
  
      {/* Las demás columnas dispuestas horizontalmente */}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4 overflow-x-auto">
          
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                key={col.id}
                column={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
          </SortableContext>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="
              h-[60px]
              w-[350px]
              min-w-[350px]
              cursor-pointer
              rounded-lg
              bg-mainBackgroundColor
              border-2
              border-columnBackgroundColor
              p-4
              ring-rose-500
              hover:ring-2
              flex
              gap-2
            "
          >
            <PlusIcon />
            Añadir organización
          </button>
        </div>

        <div className="mt-4 flex justify-center">
                <ColumnContainer
                  key={staticColumnBottom.id}
                  column={staticColumnBottom}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === staticColumnBottom.id)}
                  deleteColumn={(_id: Id) => {
                    // No hacer nada ya que es estática
                  }}
                  />
                </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
  
 

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Nombre ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;