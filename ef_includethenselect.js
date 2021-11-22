                var query = await _context.Person.Include(x => x.Position)
                    .Where(w =>
                     string.IsNullOrEmpty(search) ? true :
                        (w.FirstName.ToLower() + w.LastName.ToLower()).Contains(search.ToLower()) ||
                     w.Position.PositionName.ToLower().Contains(search.ToLower()) ||
                      w.Tels.Contains(search.ToLower()) ||
                      w.HydroUser.Select(s => s.StationCenter.StationCenterName.ToLower()).Contains(search.ToLower())
                    ).Select(s => new vmPerson
                    {
                        Active = s.Active,
                        FirstName = s.FirstName??"",
                        LastName = s.LastName ?? "",
                        PersonId = s.PersonId,
                        position = new vmPosition
                        {
                            PositionID = s.PositionId == null ? s.PositionId.ToString() : "",
                            PositionName = s.Position.PositionName ?? "",
                            ShortName = s.Position.ShortName ?? ""
                        },
                        prename = new vmPreName { PreNameID = s.PreNameId, PreNameValue = s.PreName.PreNameValue },
                        Tels = s.Tels
                        
                    })
                    .ToListAsync();
