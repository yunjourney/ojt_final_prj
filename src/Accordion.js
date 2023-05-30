import { useEffect, useState } from "react";
import "./AccoCss.css";

function Accordion({ title, contents }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = contents.map((content) => ({
      title: title,
      content: typeof content === "object" ? content.content : content,
      isOpen: false,
      search: true,
    }));
    setItems(newItems);
    // setItems((prevItems) => [...prevItems, newItems]);
  }, [title, contents]);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    // const updatedItems = [...items];
    // setItems(updatedItems);
    setActiveIndex(index === activeIndex ? null : index);
  };


  return (
    <div className="accordion">
      {contents.map((item, index) => (
        <div key={index}>
          <div
            className={`accordion-item ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div
              className="accordion-title"
              onClick={() => handleToggle(index)}
            >
              {title}
            </div>
            <div className="accordion-content">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Accordion;
