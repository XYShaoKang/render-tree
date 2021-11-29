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
    const nodes = new Map<
      DataNode,
      { val: number; x: number; y: number; wide: number }
    >()
    const edges: { from: [number, number]; to: [number, number] }[] = []
    const gap = 50
    let top = 50
    const queue: (DataNode | null)[][] = [[root]]

    // 用 BFS 遍历树,按层将结点放入 queue 中
    while (true) {
      const tmp: (DataNode | null)[] = []
      let foundChild = false
      for (const node of queue[queue.length - 1]) {
        if (node && node.children.length) {
          foundChild = true
          tmp.push(...node.children)
        } else {
          // 当结点没有子结点时,填充 null,预留宽度
          tmp.push(null)
        }
      }
      if (!foundChild) break

      queue.push(tmp)
    }

    // 自底向上遍历 queue,先计算子结点的位置以及宽度,然后父结点的宽度等于子结点宽度之和
    for (let i = queue.length - 1; i >= 0; i--) {
      let left = 0
      for (const node of queue[i]) {
        // 如果没有子结点,则使用默认的宽度
        let wide = gap
        if (node) {
          for (const child of node.children) {
            wide += nodes.get(child)?.wide!
          }
          // 如果有子结点,则使用子结点宽度之和,需要减去预设的默认宽度
          if (wide > gap) wide -= gap

          const x = left + (wide >>> 1),
            y = top * (i + 1)

          nodes.set(node, { x: x, y: y, val: node.val, wide })
          for (const child of node.children) {
            const n = nodes.get(child)!
            // 添加父结点和子结点的连接线
            edges.push({ from: [x, y], to: [n.x, n.y] })
          }
        }
        left += wide
      }
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
