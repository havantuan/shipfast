class WebSite {
  GetCurrent() {
    return process.env.SITE; // HUB - KH - SYSTEM
  }

  IsHub() {
    return this.GetCurrent() === "HUB";
  }

  IsKh() {
    return this.GetCurrent() === "KH";
  }

  IsSystem() {
    return this.GetCurrent() === "SYSTEM";
  }
}

const site = new WebSite();
export {site as WebSite}