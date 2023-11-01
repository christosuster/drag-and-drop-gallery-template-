import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableItem(props) {
  const { image, globalDraggingState, setGlobalDraggingState, updateSelected } =
    props;

  // State for the checkbox
  const [isChecked, setIsChecked] = useState(image.selected);

  // Properties for DndKit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Update the checkbox check/uncheck
  const handleCheck = () => {
    setIsChecked(!isChecked);
    updateSelected(image.id, !image.selected);
  };

  // Effect to update the global dragging state and checkbox status
  useEffect(() => {
    setGlobalDraggingState(isDragging);
    setIsChecked(image.selected);
  }, [isDragging, image.selected]);

  return (
    <div className="relative group">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheck}
        className={`  hidden absolute left-4 top-4 scale-125 z-50  ${
          isChecked && "!block"
        } ${!globalDraggingState && "group-hover:block"}`}
      />

      {/* CSS "before" is used for hover overlay effect */}
      <div
        ref={setNodeRef}
        className={` aspect-square shadow cursor-pointer rounded-xl origin-top-left relative  ${
          !globalDraggingState && "group-hover:before:bg-black/40"
        }  before:h-full before:w-full before:absolute before:top-0 before:left-0 before:z-10 before:rounded-xl before:border-2 before:border-black/20 before:transition-all before:duration-300 before:ease-in-out`}
        style={style}
        {...attributes}
        {...listeners}
      >
        <img
          src={image.url}
          className={`
        h-full  w-full object-cover rounded-xl  origin-center
        ${isDragging ? "hidden" : "block"}
        `}
        />
      </div>
    </div>
  );
}
