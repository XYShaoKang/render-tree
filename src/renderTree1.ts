import { DataNode } from './Tree'

type Coordinate = [number, number]

class Node {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public val: number,
  ) {}
  draw(ctx: CanvasRenderingContext2D) {
    const { x, y, radius, val } = this
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#000'
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(val + '', x, y)
  }
}
class Edge {
  constructor(public from: Coordinate, public to: Coordinate) {}
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(...this.from)
    ctx.lineTo(...this.to)
    ctx.stroke()
  }
}
class TreeCanvas {
  _ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx
  }
  drawNode(x: number, y: number, val: number, radius = 10) {
    const node = new Node(x, y, radius, val)
    node.draw(this._ctx)
  }
  drawEdge(from: Coordinate, to: Coordinate) {
    const edge = new Edge(from, to)
    edge.draw(this._ctx)
  }
  renderTree(root: DataNode) {
    const nodes = new Map<DataNode, { val: number; x: number; y: number }>()
    const edges: { from: [number, number]; to: [number, number] }[] = []
    const map = new Map<DataNode, DataNode>()
    const gap = 50
    let children = [root],
      top = 50

    while (children.length) {
      let left = 50
      const tmp: DataNode[] = []
      for (const node of children) {
        const parent = map.get(node)
        if (parent) {
          const { x, y } = nodes.get(parent)!
          edges.push({ from: [x, y], to: [left, top] })
        }

        nodes.set(node, { x: left, y: top, val: node.val })

        for (const child of node.children) {
          tmp.push(child)
          map.set(child, node)
        }

        left += gap
      }
      top += gap
      children = tmp
    }

    edges.forEach(({ from, to }) => {
      this.drawEdge(from, to)
    })
    nodes.forEach((node) => {
      this.drawNode(node.x, node.y, node.val)
    })
  }
}

export { TreeCanvas }
