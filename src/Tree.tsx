import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { TreeCanvas } from './renderTree'

const StyledCanvas = styled.canvas`
  position: relative;
  border: 1px solid #000;
`

export interface DataNode {
  val: number
  children: DataNode[]
}

const Tree: FC<{ root: DataNode }> = ({ root }) => {
  const width = 500,
    height = 500
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    let canvas = ref.current
    let context = canvas.getContext('2d')
    if (!context) return

    const treeCanvas = new TreeCanvas(context)
    treeCanvas.renderTree(root)
  })
  return <StyledCanvas ref={ref} width={width} height={height}></StyledCanvas>
}

export default Tree
