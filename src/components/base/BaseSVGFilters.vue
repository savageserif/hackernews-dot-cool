<template>
  <svg class="hidden">
    <defs>
      <filter
        id="indentation-shadows"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feComponentTransfer
          in="SourceAlpha"
          result="invertedAlpha"
        >
          <feFuncA
            type="table"
            tableValues="1 0"
          />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="2.5" />
        <feOffset
          dx="0"
          dy="2"
          result="offsetBlur"
        />
        <!-- <feFlood flood-color="red" />
        <feComposite
          in2="offsetBlur"
          operator="in"
        /> -->
        <feComponentTransfer>
          <feFuncA
            type="linear"
            slope="0.25"
          />
        </feComponentTransfer>
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="innerShadow"
        />

        <feGaussianBlur
          in="SourceAlpha"
          stdDeviation="0.5"
        />
        <feOffset
          dx="0"
          dy="1.5"
          result="offsetBlur"
        />
        <feComponentTransfer>
          <feFuncA
            type="linear"
            slope="0.6"
          />
          <feFuncR
            type="table"
            tableValues="1 0"
          />
          <feFuncG
            type="table"
            tableValues="1 0"
          />
          <feFuncB
            type="table"
            tableValues="1 0"
          />
        </feComponentTransfer>
        <feComposite
          in2="invertedAlpha"
          operator="in"
          result="outerShadow"
        />

        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="outerShadow" />
          <feMergeNode in="innerShadow" />
        </feMerge>
      </filter>
    </defs>
  </svg>
</template>
