<script setup lang="ts">
/**
 * DraftCard — thin consumer wrapper over the kit's canvas Card.
 * Fills the card's named slot regions with draft-specific content
 * (suit icon, keyword, flavor, points) using Konva nodes.
 *
 * The kit Card handles geometry, states, shadows, and slot
 * positioning. DraftCard maps game data to what renders where.
 */
import { Card } from 'boardgame-vue-kit';
import { Text as VText, Circle as VCircle, Rect as VRect } from 'vue-konva';
import { colorFor, type DraftCard } from './cards';

interface Props {
  card: DraftCard;
  x: number;
  y: number;
  width?: number;
  height?: number;
  selected?: boolean;
  inactive?: boolean;
  tapped?: boolean;
}

defineProps<Props>();

defineEmits<{ click: [] }>();
</script>

<template>
  <Card
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :selected="selected"
    :inactive="inactive"
    :tapped="tapped"
    :name="card.name"
    @click="$emit('click')"
  >
    <!-- suit icon (top-right badge with first letter of suit) -->
    <template #icon="{ x: ix, y: iy, w, h }">
      <v-circle
        :config="{
          x: ix + w - h / 2 - 2,
          y: iy + h / 2,
          radius: h / 2 - 2,
          fill: colorFor(card.suit),
        }"
      />
      <v-text
        :config="{
          x: ix + w - h - 2,
          y: iy,
          width: h,
          height: h,
          text: card.suit.charAt(0).toUpperCase(),
          fontSize: Math.max(10, h * 0.55),
          fontStyle: 'bold',
          fill: '#000',
          align: 'center',
          verticalAlign: 'middle',
        }"
      />
    </template>

    <!-- keyword band + flavor text in the effect region -->
    <template #effect="{ x: ex, y: ey, w, h }">
      <v-rect
        :config="{
          x: ex,
          y: ey,
          width: w,
          height: h * 0.3,
          fill: 'rgba(88, 166, 255, 0.12)',
          cornerRadius: 3,
        }"
      />
      <v-text
        :config="{
          x: ex + 4,
          y: ey + 4,
          width: w - 8,
          text: card.keyword,
          fontSize: Math.max(9, h * 0.17),
          fontStyle: 'bold',
          fill: '#58a6ff',
          wrap: 'word',
        }"
      />
      <v-text
        :config="{
          x: ex + 4,
          y: ey + h * 0.35,
          width: w - 8,
          height: h * 0.6,
          text: card.flavor,
          fontSize: Math.max(8, h * 0.13),
          fontStyle: 'italic',
          fill: '#8b949e',
          wrap: 'word',
          lineHeight: 1.25,
        }"
      />
    </template>

    <!-- points in the footer (right-aligned) -->
    <template #footer="{ x: fx, y: fy, w, h }">
      <v-text
        :config="{
          x: fx,
          y: fy,
          width: w,
          height: h,
          text: `${card.points} pts`,
          fontSize: Math.max(11, h * 0.55),
          fontStyle: 'bold',
          fill: '#3fb950',
          align: 'right',
          verticalAlign: 'middle',
        }"
      />
    </template>
  </Card>
</template>
