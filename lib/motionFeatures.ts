/**
 * framer-motion feature set, in its own module so `LazyMotion` can pull it in
 * as a *separate async chunk* (see MotionProvider). Keeping this import out of
 * the provider's own module is what lets the bundler split domMax off the
 * critical path: the slim `m.*` components hydrate immediately, and this ~60KB
 * feature bundle loads right after, instead of blocking the first paint.
 *
 * domMax (not domAnimation) because Regions uses `layoutId` (shared-layout
 * animation), which only the max feature set provides.
 */
import { domMax } from "framer-motion";

export default domMax;
