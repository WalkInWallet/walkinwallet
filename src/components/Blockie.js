import Blockies from "react-blockies";
import { Skeleton } from "antd";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  blockie: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 4px",
    "& > canvas": { borderRadius: "50%" },
  },
});

const Blockie = (props) => {
  const classes = useStyles();
  let scale = 5;

  if (props.scale) {
    scale = props.scale;
  }

  if (!props.address) {
    return <Skeleton.Avatar active size={40} />;
  } else {
    return (
      <div className={classes.blockie}>
        <Blockies seed={props.address.toLowerCase()} scale={scale} />
      </div>
    );
  }
};

export default Blockie;
