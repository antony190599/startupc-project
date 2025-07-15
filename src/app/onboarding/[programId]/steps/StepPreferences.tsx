import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sports, hobbies, movieGenres } from "@/lib/enum";
import React from "react";

interface StepPreferencesProps {
  form: any;
}

const StepPreferences: React.FC<StepPreferencesProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias Personales</CardTitle>
        <p className="text-sm text-gray-600">
          Conoce un poco más sobre tus gustos personales. Esta información nos ayuda a personalizar tu experiencia.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="favoriteSport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deporte favorito</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su deporte favorito" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(sports).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favoriteHobby"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hobby favorito</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su hobby favorito" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(hobbies).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="favoriteMovieGenre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Si tuvieras que elegir un género de películas para ver, ¿cuál elegirías?</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione su género de películas favorito" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(movieGenres).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default StepPreferences; 