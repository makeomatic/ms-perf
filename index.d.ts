declare function perf(name: string): perf.measureThunk
declare function perf(name: string, opts: { thunk: false }): perf.measure

declare namespace perf {
    interface Timers {
        [entry: string]: string
    }

    interface measureThunk {
        (step: string): () => number
        (): () => Timers
    }

    interface measure {
        (step: string): number
        (): Timers
    }
}

export = perf
