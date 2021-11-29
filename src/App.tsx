import { useState } from 'react'
import styled from 'styled-components'

import Tree from './Tree'

const Container = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`

const root = {
  val: 1,
  children: [
    { val: 2, children: [] },
    {
      val: 3,
      children: [
        { val: 5, children: [] },
        { val: 6, children: [] },
        {
          val: 7,
          children: [
            { val: 11, children: [] },
            { val: 12, children: [] },
          ],
        },
        { val: 8, children: [] },
      ],
    },
    {
      val: 4,
      children: [
        { val: 9, children: [] },
        { val: 10, children: [] },
      ],
    },
  ],
}

function App() {
  return (
    <Container>
      <Tree root={root}></Tree>
    </Container>
  )
}

export default App
