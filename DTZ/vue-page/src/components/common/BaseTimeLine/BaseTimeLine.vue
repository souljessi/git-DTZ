<template>
    <ul :class="classes">
        <slot></slot>
    </ul>
</template>
<script>


    export default {
        name: 'BaseTimeline',
        props: {
            pending: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            classes () {
                return [
                    `base-timeline`,
                    {
                        [`base-timeline-pending`]: this.pending
                    }
                ];
            }
        }
    };
</script>


