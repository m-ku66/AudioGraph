import React from "react";

type Props = {
  spineState: string;
  setSpineState: React.Dispatch<React.SetStateAction<string>>;
  dataArray: Uint8Array;
};

const Spine = ({ spineState, setSpineState, dataArray }: Props) => {
  const spines = new Array(26).fill(0);

  return (
    <div
      onClick={() => setSpineState(spineState === "px" ? "rem" : "px")}
      className="z-10 cursor-pointer flex items-center gap-2 w-[90%] justify-center"
    >
      {spines.map((_, index) => (
        <div
          key={index}
          className="w-fit h-fit bg-primary py-0 hover:py-32 duration-150"
        >
          <div
            style={{
              width: `2.5rem`,
              height: `${
                dataArray[index % dataArray.length] *
                (spineState === "px" ? 0.5 : 0.1)
              }${spineState}`,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default Spine;
