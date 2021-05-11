export default interface SvnUtils {
  getLocalRev: () => string;
  getRemoteRev: Promise<string>;
  getSVNPath: Promise<string>;
  matchSVNLogRev: () => string;
  matchSVNInfoRev: () => string;
}