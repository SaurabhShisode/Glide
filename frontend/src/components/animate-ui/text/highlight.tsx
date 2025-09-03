'use client';

import * as React from 'react';
import {
  motion,
  useInView,
  type HTMLMotionProps,
  type Transition,
  type UseInViewOptions,
} from 'motion/react';

import { cn } from "@/lib/utils";


type HighlightTextProps = HTMLMotionProps<'span'> & {
  text: string;
  inView?: boolean;
  inViewMargin?: UseInViewOptions['margin'];
  inViewOnce?: boolean;
  transition?: Transition;
};

function HighlightText({
  ref,
  text,
  className,
  inView = false,
  inViewMargin = '0px',
  transition = { duration: 2, ease: 'easeInOut' },
  ...props
}: HighlightTextProps) {
  const localRef = React.useRef<HTMLSpanElement>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement);

  const inViewResult = useInView(localRef, {
    once: true,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  return (
    <motion.span
      ref={localRef}
      data-slot="highlight-text"
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
      transition={{
    duration: 2,
    ease: "easeInOut",
    delay: 3, 
  }}
      style={{
        backgroundImage: "linear-gradient(120deg, #535C91 0%, #7c81f3 100%)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 90%",
        display: "inline-flex",
        alignItems: "center",
        padding: "5px 10px",
      }}
      className={cn("relative inline-block justify-center rounded-xl", className)}
      {...props}
    >
      {text}
    </motion.span>
  );
}

export { HighlightText, type HighlightTextProps };
