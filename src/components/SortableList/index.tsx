import { useEffect, useRef, useState } from "react";
import "./style.scss";

function switchDisplay(el: Element, sel: string, value: boolean) {
  (el.querySelector(sel) as HTMLElement).style.display = value ? "" : "none";
}

function limitBetween(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export interface DragItemConfig {
  position?: {
    x?: number;
    y?: number;
  };
}

export interface SortableListProps<T> {
  items: T[];
  dragItemConfig: DragItemConfig;
}

function SortableList<T>({ items, dragItemConfig }: SortableListProps<T>) {
  const { position: dragItemPosition } = dragItemConfig;

  const [list, setList] = useState<T[]>(items);
  const position = useRef<string>("");
  const placeholder = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    setList(items);
  }, [items]);

  useEffect(() => {
    placeholder.current = new Map();
  }, [list]);

  return (
    <div
      className="sortable-list"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {list.map((item, i) => (
        <div
          onDragOver={(ev) => {
            ev.preventDefault();
            ev.dataTransfer.dropEffect = "move";
            if (ev.currentTarget.offsetParent) {
              const parentClientRect =
                ev.currentTarget.offsetParent.getBoundingClientRect();

              ev.currentTarget.parentElement
                ?.querySelectorAll("hr")
                .forEach((el) => ((el as HTMLElement).style.display = "none"));
              if (
                ev.pageY >
                parentClientRect.top +
                  ev.currentTarget.offsetTop +
                  ev.currentTarget.offsetHeight / 2
              ) {
                position.current = "bottom";
                switchDisplay(ev.currentTarget, "hr.bot", true);
                switchDisplay(ev.currentTarget, "hr.top", false);
              } else {
                position.current = "top";
                switchDisplay(ev.currentTarget, "hr.bot", false);
                switchDisplay(ev.currentTarget, "hr.top", true);
              }
            }
          }}
          onDragExit={(ev) => {
            ev.preventDefault();
            switchDisplay(ev.currentTarget, "hr.bot", false);
            switchDisplay(ev.currentTarget, "hr.top", false);
          }}
          onDrop={(ev) => {
            ev.preventDefault();
            const self = +ev.dataTransfer.getData("application/json");
            const modif = position.current === "top" ? -1 : 0;
            const newPos = i + modif;
            const reorderedList = [...list];
            reorderedList.splice(
              limitBetween(newPos < self ? newPos + 1 : newPos, 0, list.length),
              0,
              reorderedList.splice(self, 1)[0]
            );
            setList(reorderedList);
          }}
        >
          <hr className="top" style={{ display: "none" }} />
          <div
            key={i}
            draggable={true}
            onDragStart={(ev) => {
              ev.currentTarget.classList.add("item-dragged");
              ev.dataTransfer.setData("application/json", `${i}`);
              ev.dataTransfer.effectAllowed = "move";
              ev.dataTransfer.setDragImage(
                ev.currentTarget,
                dragItemPosition?.x || 0,
                dragItemPosition?.y || 0
              );
            }}
            onDragEnd={(ev) => {
              ev.preventDefault();
              ev.currentTarget.classList.remove("item-dragged");
              ev.currentTarget.parentElement?.parentElement
                ?.querySelectorAll("hr")
                .forEach((el) => ((el as HTMLElement).style.display = "none"));
            }}
          >
            {item}
          </div>
          <hr className="bot" style={{ display: "none" }} />
        </div>
      ))}
    </div>
  );
}

export default SortableList;
