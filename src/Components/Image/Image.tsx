import React from "react";
export default function Image(props: any) {
  return (
    <div>
      <img alt={props.alt} {...props} />
    </div>
  );
}
