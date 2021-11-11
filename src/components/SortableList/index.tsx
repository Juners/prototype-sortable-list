import { useEffect, useRef, useState } from "react";
import "./style.scss";

function limitBetween(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export interface SortableListProps<T> {
  items: T[];
}

function SortableList<T>({ items }: SortableListProps<T>) {
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
    <div className="sortable-list" style={{ display: "flex", flexDirection: "column" }}>
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
                ev.screenY >
                parentClientRect.top +
                  ev.currentTarget.offsetTop +
                  ev.currentTarget.offsetHeight / 2
              ) {
                position.current = "bottom";
                (
                  ev.currentTarget.querySelector("hr.bot") as HTMLElement
                ).style.display = "";
                (
                  ev.currentTarget.querySelector("hr.top") as HTMLElement
                ).style.display = "none";
              } else {
                (
                  ev.currentTarget.querySelector("hr.top") as HTMLElement
                ).style.display = "";
                (
                  ev.currentTarget.querySelector("hr.bot") as HTMLElement
                ).style.display = "none";
                position.current = "top";
              }
            }
          }}
          onDragExit={(ev) => {
            ev.preventDefault();
            (
              ev.currentTarget.querySelector("hr.top") as HTMLElement
            ).style.display = "none";
            (
              ev.currentTarget.querySelector("hr.bot") as HTMLElement
            ).style.display = "none";
          }}
          onDrop={(ev) => {
            ev.preventDefault();
            const self = +ev.dataTransfer.getData("application/json");
            const modif = position.current === "top" ? -1 : 0;
            const newPos = i + modif;
            const listerino = [...list];
            listerino.splice(
              limitBetween(newPos < self ? newPos + 1 : newPos, 0, list.length),
              0,
              listerino.splice(self, 1)[0]
            );
            setList(listerino);
          }}
        >
          <hr className="top" style={{ display: "none" }} />
          <div
            key={i}
            draggable={true}
            onDragStart={(ev) => {
              ev.currentTarget.style.opacity = "50%";
              ev.dataTransfer.setData("application/json", `${i}`);
              ev.dataTransfer.effectAllowed = "move";
            }}
            onDragEnd={(ev) => {
              ev.preventDefault();
              ev.currentTarget.style.opacity = "100%";
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
