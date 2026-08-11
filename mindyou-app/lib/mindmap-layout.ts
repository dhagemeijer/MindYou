export interface MindmapNode {
  id: string;
  label: string;
  parentId: string | null;
  promotedItemId: string | null;
}

export interface PositionedNode extends MindmapNode {
  x: number;
  y: number;
  depth: number;
  children: PositionedNode[];
}

const RADIUS_STEP = 150;

/** Bouwt een boom van platte nodes en rekent voor elke node een positie uit:
 * het centrale onderwerp staat op (0,0), takken krijgen een hoek-"wig"
 * verdeeld naar aantal (klein)kinderen, zodat een tak met meer kinderen meer
 * ruimte om zich heen krijgt — het klassieke sunburst/radiale idee. */
export function computeRadialLayout(
  centerLabel: string,
  nodes: MindmapNode[]
): PositionedNode & { children: PositionedNode[] } {
  const byParent = new Map<string | null, MindmapNode[]>();
  for (const n of nodes) {
    const key = n.parentId;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(n);
  }

  function subtreeSize(id: string | null): number {
    const children = byParent.get(id) ?? [];
    if (children.length === 0) return 1;
    return children.reduce((sum, c) => sum + subtreeSize(c.id), 1);
  }

  function layout(
    parentId: string | null,
    angleStart: number,
    angleEnd: number,
    depth: number
  ): PositionedNode[] {
    const children = byParent.get(parentId) ?? [];
    if (children.length === 0) return [];

    const weights = children.map((c) => subtreeSize(c.id));
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let cursor = angleStart;
    const result: PositionedNode[] = [];
    children.forEach((child, i) => {
      const span = ((angleEnd - angleStart) * weights[i]) / totalWeight;
      const angle = cursor + span / 2;
      const radius = depth * RADIUS_STEP;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      result.push({
        ...child,
        x,
        y,
        depth,
        children: layout(child.id, cursor, cursor + span, depth + 1),
      });
      cursor += span;
    });
    return result;
  }

  return {
    id: "__root__",
    label: centerLabel,
    parentId: null,
    promotedItemId: null,
    x: 0,
    y: 0,
    depth: 0,
    children: layout(null, -Math.PI / 2, (3 * Math.PI) / 2, 1),
  };
}

/** Platte lijst van alle nodes inclusief het centrum, handig om te renderen. */
export function flattenPositioned(
  root: PositionedNode
): PositionedNode[] {
  const out: PositionedNode[] = [root];
  function walk(n: PositionedNode) {
    for (const c of n.children) {
      out.push(c);
      walk(c);
    }
  }
  walk(root);
  return out;
}

/** Alle parent→kind lijn-segmenten, voor het tekenen van de verbindingen. */
export function edgesOf(root: PositionedNode): { from: PositionedNode; to: PositionedNode }[] {
  const edges: { from: PositionedNode; to: PositionedNode }[] = [];
  function walk(n: PositionedNode) {
    for (const c of n.children) {
      edges.push({ from: n, to: c });
      walk(c);
    }
  }
  walk(root);
  return edges;
}
