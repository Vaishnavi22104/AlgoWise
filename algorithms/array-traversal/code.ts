import { defineCode, type Implementations } from "@/core/algorithm/languages";

/** Markers like //@loop and #@loop name the lines a step can highlight; they are removed from the displayed code. */
export const languages: Implementations = {
  java: defineCode(`public static void main(String[] args) {
    int[] arr = {4, 9, 2, 7, 5};             //@init
    int total = 0;                           //@total
    for (int i = 0; i < arr.length; i++) {   //@loop
        int current = arr[i];                //@read
        total += current;                    //@add
    }
    System.out.println(total);               //@result
}`),
  python: defineCode(`arr = [4, 9, 2, 7, 5]          #@init
total = 0                       #@total
for i in range(len(arr)):       #@loop
    current = arr[i]            #@read
    total += current            #@add
print(total)                    #@result`),
};
