import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const loader = () => {
  const Container = styled(motion.div)`
    padding-top: 5rem;
    width: 100%;
    align-items: center;
    justify-content: center;
  `;
  const AnimationContainer = styled(motion.div)`
    width: 92px;
    height: 92px;
    position: relative;
    mix-blend-mode: difference;
    display: flex;
    margin: auto;
  `;
  const Square1 = styled(motion.div)`
    width: 60px;
    height: 60px;
    background-color: #86a760;
    border-radius: 9px;
    position: absolute;
    mix-blend-mode: difference;
  `;
  const Square2 = styled(motion.div)`
    width: 60px;
    height: 60px;
    background-color: #86a760;
    border-radius: 9px;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    mix-blend-mode: difference;
  `;
  const Square3 = styled(motion.div)`
    width: 60px;
    height: 60px;
    background-color: #86a760;
    border-radius: 9px;
    position: absolute;
    bottom: 0;
    right: 0;
    mix-blend-mode: difference;
  `;
  const Text = styled.p`
    text-align: center;
    font-size: 2rem;
    color: #79589f;
  `;
  const ContainerVariants = {
    initial: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const DotVariants = {
    initial: {
      y: "-15%",
      x: "15%",
    },
    animate: {
      y: "15%",
      x: "-15%",
    },
  };

  const DotTransition = {
    duration: 1.5,
    repeatType: "mirror",
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <Container>
      <AnimationContainer
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
      >
        <Square1 variants={DotVariants} transition={DotTransition} />
        <Square2 variants={DotVariants} transition={DotTransition} />
        <Square3 variants={DotVariants} transition={DotTransition} />
      </AnimationContainer>
      {/* <Text>Loading...</Text> */}
    </Container>
  );
};

export default loader;
