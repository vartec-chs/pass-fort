import React from 'react'

import MuiBox, { BoxProps } from '@mui/material/Box'

import { motion } from 'motion/react'

const BoxComponent = React.forwardRef((props: BoxProps, ref) => <MuiBox {...props} ref={ref} />)

export const MotionBox = motion(BoxComponent)
