export default function deleteUndef(obj: object): void {
  Object.keys(obj).forEach(key =>
    obj[key as keyof typeof obj] === undefined ? delete obj[key as keyof typeof obj] : {},
  );
}
