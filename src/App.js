import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragOverlay,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { BiImageAdd } from "react-icons/bi";
import { useCallback, useEffect, useState } from "react";
import { SortableItem } from "./components/SortableItem";
import { getImages } from "./utils/images";

function App() {
  // State variables
  const [images, setImages] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [globalDraggingState, setGlobalDraggingState] = useState(false);
  const [counter, setCounter] = useState(0);
  const [checkedAll, setCheckedAll] = useState(true);

  // Fetch images when the component mounts
  useEffect(() => {
    const imageData = getImages();
    setImages(imageData);
  }, []);

  // Function to delete selected items
  const deleteItems = () => {
    const newImages = images.filter((image) => !image.selected);
    setImages(newImages);
    setCounter(0);
  };

  // Function to update selected status of an image
  const updateSelected = (id, val) => {
    const idx = images.findIndex((image) => image.id == id);
    if (val) {
      setCounter(counter + 1);
    } else {
      setCounter(counter - 1);
    }
    images[idx].selected = val;
    setImages(images);
  };

  // Function to uncheck all selected images
  const uncheckedAll = () => {
    setCounter(0);
    const newImages = [...images];
    newImages.map((image) => {
      image.selected = false;
    });

    setImages(newImages);
  };

  //Drag event handlers for DndKit
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setImages((images) => {
        const oldIndex = images.findIndex((image) => {
          return image?.id === active?.id;
        });
        const newIndex = images.findIndex((image) => {
          return image?.id === over?.id;
        });

        return arrayMove(images, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }, []);
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  // Define sensors for DndKit to implement touch and mouse events
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <div className="App bg-slate-200 min-h-screen flex justify-center items-center p-10">
      <div className="lg:w-[60vw] w-[80vw] min-h-[80vh] rounded-2xl bg-white">
        <div className="border-b-2 px-5 py-3 flex justify-between ">
          <div className="text-xl font-bold">
            {counter == 0 && <h1 className="">Gallery</h1>}

            {counter > 0 && (
              <div className="flex">
                <input
                  type="checkbox"
                  checked={checkedAll}
                  onChange={uncheckedAll}
                  className="mr-2 scale-125"
                />
                <h1>{counter} File Selected</h1>
              </div>
            )}
          </div>

          {counter > 0 && (
            <button className="text-red-500 font-bold" onClick={deleteItems}>
              Delete Files
            </button>
          )}
        </div>

        {/* DndContext and SortableContext from DndKit */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-3 gap-5 row-auto p-5 grid-flow-row ">
              {/* First item will take 2*2 cells of grid */}
              {images.map((image, i) => {
                if (i == 0) {
                  return (
                    <div
                      className="col-span-2 row-span-2 aspect-square"
                      key={image.id}
                    >
                      <SortableItem
                        image={image}
                        globalDraggingState={globalDraggingState}
                        setGlobalDraggingState={setGlobalDraggingState}
                        updateSelected={updateSelected}
                      />
                    </div>
                  );
                }
                return (
                  <div key={image.id} className="col-span-1 aspect-square">
                    <SortableItem
                      image={image}
                      globalDraggingState={globalDraggingState}
                      setGlobalDraggingState={setGlobalDraggingState}
                      updateSelected={updateSelected}
                    />
                  </div>
                );
              })}
              <div
                className={` aspect-square rounded-xl border-2 
                border-dashed border-black/20 cursor-pointer flex flex-col justify-center items-center col-span-1 row-span-1`}
              >
                <BiImageAdd className="text-2xl" />
                <h1>Add Images</h1>
              </div>
            </div>
          </SortableContext>

          {/* DragOverlay from DndKit to display floating card when dragged*/}
          <DragOverlay adjustScale style={{ transformOrigin: "50 50" }}>
            {activeId ? (
              <img
                src={images.find((image) => image.id === activeId).url}
                className="h-full  w-full object-cover rounded-xl shadow-xl shadow-black/30"
                id={activeId}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
