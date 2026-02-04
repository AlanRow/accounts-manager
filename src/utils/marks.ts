import type { Mark } from "@/types"

const MARKS_DELIMITER = ";"

export function parseLineToMarks(line: string): Mark[] {
  return line.split(MARKS_DELIMITER).map(text => ({ text }))
}

export function convertMarksToLine(marks: Mark[]): string {
  return marks.map(({ text }) => text).join(MARKS_DELIMITER)
}