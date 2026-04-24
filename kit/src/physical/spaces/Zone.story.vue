<docs lang="md">
# Zone

Universal container — "a space where components can be placed."
Zones nest freely, have an optional `#surface` for rendered
backgrounds, and a `layout` policy that positions children.

The default slot is **scoped** — it receives `{ index, x, y, w, h }`
once per cell (up to `count`). Consumer uses those values to place
a piece at each position.

## Layouts
- `row` — horizontal, gap between cells
- `col` — vertical, gap between cells
- `hand` — row that contracts (overlaps) when tight
- `stack` — each cell offset by `--stack-step`
- `grid` — rows × `cols`
- `free` — all cells at (0,0); consumer positions manually
</docs>

<script setup lang="ts">
import Stage from '../../canvas/Stage.vue';
import Layer from '../../canvas/Layer.vue';
import Zone from './Zone.vue';
</script>

<template>
  <Story title="physical/spaces/Zone" group="Physical">
    <Variant title="Layouts side by side">
      <Stage :width="900" :height="520">
        <Layer>
          <!-- row -->
          <Zone :count="4" layout="row" :x="20" :y="20" :cell-width="80" :cell-height="100" :gap="8" v-slot="{ x, y, w, h, index }">
            <v-rect :config="{ x, y, width: w, height: h, fill: '#58a6ff', cornerRadius: 6 }" />
            <v-text :config="{ x, y: y + h/2 - 8, width: w, text: `row ${index}`, align: 'center', fill: '#000', fontSize: 12 }" />
          </Zone>

          <!-- col -->
          <Zone :count="3" layout="col" :x="20" :y="140" :cell-width="80" :cell-height="40" :gap="6" v-slot="{ x, y, w, h, index }">
            <v-rect :config="{ x, y, width: w, height: h, fill: '#3fb950', cornerRadius: 6 }" />
            <v-text :config="{ x, y: y + h/2 - 6, width: w, text: `col ${index}`, align: 'center', fill: '#000', fontSize: 12 }" />
          </Zone>

          <!-- hand -->
          <Zone :count="7" layout="hand" :x="140" :y="20" :width="540" :height="120" :cell-width="90" :cell-height="120" v-slot="{ x, y, w, h, index }">
            <v-rect :config="{ x, y, width: w, height: h, fill: '#a371f7', stroke: '#000', strokeWidth: 1, cornerRadius: 8 }" />
            <v-text :config="{ x, y: y + 8, width: w, text: String(index), align: 'center', fill: '#fff', fontSize: 12 }" />
          </Zone>

          <!-- stack -->
          <Zone :count="5" layout="stack" :x="140" :y="160" :cell-width="80" :cell-height="100" v-slot="{ x, y, w, h }">
            <v-rect :config="{ x, y, width: w, height: h, fill: '#d29922', stroke: '#000', strokeWidth: 1, cornerRadius: 6 }" />
          </Zone>

          <!-- grid -->
          <Zone :count="9" layout="grid" :cols="3" :x="300" :y="160" :cell-width="60" :cell-height="60" :gap="6" v-slot="{ x, y, w, h, index }">
            <v-rect :config="{ x, y, width: w, height: h, fill: '#f85149', cornerRadius: 4 }" />
            <v-text :config="{ x, y: y + h/2 - 6, width: w, text: String(index), align: 'center', fill: '#fff', fontSize: 12 }" />
          </Zone>
        </Layer>
      </Stage>
    </Variant>

    <Variant title="Nested Zones — Splendor-market-style">
      <Stage :width="600" :height="380">
        <Layer>
          <!-- outer: 3-row col; each row is itself a Zone laying out 4 cells. -->
          <Zone :count="3" layout="col" :x="20" :y="20" :cell-width="520" :cell-height="100" :gap="12" v-slot="{ y: rowY, index: rowIdx }">
            <Zone
              :count="4"
              layout="row"
              :x="0"
              :y="rowY"
              :cell-width="120"
              :cell-height="100"
              :gap="10"
              v-slot="{ x, y, w, h, index: colIdx }"
            >
              <v-rect
                :config="{
                  x, y, width: w, height: h,
                  fill: ['#58a6ff', '#3fb950', '#d29922'][rowIdx],
                  cornerRadius: 6,
                }"
              />
              <v-text :config="{ x, y: y + h/2 - 8, width: w, text: `r${rowIdx}c${colIdx}`, align: 'center', fill: '#000', fontSize: 12 }" />
            </Zone>
          </Zone>
        </Layer>
      </Stage>
    </Variant>

    <Variant title="#surface slot — zone with a rendered background">
      <Stage :width="500" :height="220">
        <Layer>
          <Zone :count="3" layout="row" :x="20" :y="20" :width="460" :height="180" :cell-width="120" :cell-height="160" :gap="20" :padding="20">
            <template #surface="{ w, h }">
              <v-rect :config="{ x: 0, y: 0, width: w, height: h, fill: '#131922', stroke: '#30363d', strokeWidth: 1, cornerRadius: 8 }" />
            </template>
            <template #default="{ x, y, w, h }">
              <v-rect :config="{ x, y, width: w, height: h, fill: '#1c2332', stroke: '#58a6ff', strokeWidth: 1, cornerRadius: 6 }" />
            </template>
          </Zone>
        </Layer>
      </Stage>
    </Variant>
  </Story>
</template>
