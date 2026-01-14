
import { MOCK_BUILDINGS, MOCK_BUSINESSES, MOCK_ZONES } from '../data/mockData';
import { Building, Business, StreetZone, BuildingComment } from '../types';

class DBService {
  private buildings: Building[] = [...MOCK_BUILDINGS];
  private businesses: Business[] = [...MOCK_BUSINESSES];
  private zones: StreetZone[] = [...MOCK_ZONES];
  private comments: BuildingComment[] = [];

  getBuildings() { return this.buildings; }
  getZones() { return this.zones; }
  getBusinesses() { return this.businesses; }

  getBuildingBySlug(slug: string) {
    return this.buildings.find(b => b.slug === slug);
  }

  getBuildingById(id: string) {
    return this.buildings.find(b => b.building_id === id);
  }

  getZoneBySlug(slug: string) {
    return this.zones.find(z => z.slug === slug);
  }

  getBusinessesInBuilding(buildingId: string) {
    return this.businesses.filter(b => b.building_id === buildingId);
  }

  getBusinessesInZone(zoneId: string) {
    const buildingIds = this.buildings
      .filter(b => b.street_zone_id === zoneId)
      .map(b => b.building_id);
    return this.businesses.filter(b => buildingIds.includes(b.building_id));
  }

  getBusinessById(id: string) {
    return this.businesses.find(b => b.business_id === id);
  }

  getTrendingBusinesses() {
    // Return verified businesses as default listing items
    return this.businesses.filter(b => b.is_verified).slice(0, 5);
  }

  search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { businesses: [], buildings: [], zones: [] };

    // Priority 1: Business name starts with query
    const bizPrefix = this.businesses.filter(b => 
      b.business_name.toLowerCase().startsWith(q)
    );
    
    // Priority 2: Business name contains query (excluding prefix matches)
    const bizContains = this.businesses.filter(b => 
      !b.business_name.toLowerCase().startsWith(q) && 
      b.business_name.toLowerCase().includes(q)
    );

    // Priority 3: Category matches
    const bizCategory = this.businesses.filter(b => 
      !b.business_name.toLowerCase().includes(q) && 
      b.categories.some(c => c.toLowerCase().includes(q))
    );

    const matchedBusinesses = [...bizPrefix, ...bizContains, ...bizCategory];

    const matchedBuildings = this.buildings.filter(b => 
      b.building_name.toLowerCase().includes(q) || 
      b.building_address.toLowerCase().includes(q)
    );

    const matchedZones = this.zones.filter(z => 
      z.zone_name.toLowerCase().includes(q)
    );

    return { 
      businesses: matchedBusinesses, 
      buildings: matchedBuildings, 
      zones: matchedZones 
    };
  }

  updateBusiness(id: string, updates: Partial<Business>) {
    this.businesses = this.businesses.map(b => 
      b.business_id === id ? { ...b, ...updates } : b
    );
  }

  updateBuilding(id: string, updates: Partial<Building>) {
    this.buildings = this.buildings.map(b => 
      b.building_id === id ? { ...b, ...updates } : b
    );
  }

  addBuilding(building: Building) {
    this.buildings.push(building);
    return building;
  }

  mergeBuildings(sourceId: string, targetId: string) {
    this.businesses = this.businesses.map(b => 
      b.building_id === sourceId ? { ...b, building_id: targetId } : b
    );
    this.deleteBuilding(sourceId);
  }

  addBusiness(business: Business) {
    this.businesses.push(business);
  }

  addZone(zone: StreetZone) {
    this.zones.push(zone);
  }

  deleteBuilding(id: string) {
    this.buildings = this.buildings.filter(b => b.building_id !== id);
  }

  deleteBusiness(id: string) {
    this.businesses = this.businesses.filter(b => b.business_id !== id);
  }

  getCommentsForBuilding(buildingId: string) {
    return this.comments.filter(c => c.building_id === buildingId);
  }

  getAllComments() {
    return this.comments;
  }

  addComment(comment: Omit<BuildingComment, 'id' | 'created_at'>) {
    const newComment: BuildingComment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    this.comments.push(newComment);
  }
}

export const db = new DBService();
